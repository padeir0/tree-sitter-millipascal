module.exports = grammar({
  name: 'millipascal',

  word: $ => $.id,

  extras: $ => [
    $.comment,
    /\s/
  ],
  rules: {
    source_file: $ => seq(
      repeat($.coupling),
      repeat($.attrSymbol),
    ),
    coupling: $ => choice(
      $.import, $.fromImport, $.export
    ),
    attrSymbol: $ => seq(
      optional($.attr), $.symbol, optional(';')
    ),
    attr: $ => seq('attr', $.idList),
    idList: $ => seq(
      $.id, repeat(seq(',', $.id)), optional(',')
    ),
    symbol: $ => choice(
      $.procedure, $.data, $.const, $.struct,
    ),

    import: $ => seq(
      'import', $.items
    ),
    fromImport: $ => seq(
      'from', $.id, 'import', $.items
    ),
    export: $ => seq(
      'export', $.items
    ),
    items : $ => choice($.aliasList, 'all'),
    aliasList: $ => seq(
      $.alias, repeat(seq(',', $.alias)), optional(',')
    ),
    alias: $ => seq($.id, optional(seq('as', $.id))),

    struct: $ => seq(
      'struct', $.id, optional($.size),
      'begin', repeat(seq($.field, ';')), 'end' 
    ),
    size: $ => seq(
      '[', $.expr, ']'
    ),
    field: $ => seq(
      $.idList, $.annot, optional($.offset)
    ),
    offset: $ => seq(
      '{', $.expr, '}'
    ),

    const: $ => seq(
      'const', choice($.singleConst, $.multipleConst),
    ),
    singleConst: $ => seq($.id, optional($.annot), '=', $.expr,),
    multipleConst: $ => seq(
      'begin',
      repeat(seq($.singleConst, ';')),
      'end'
    ),

    data: $ => seq(
      'data', choice($.singleData, $.multipleData),
    ),
    singleData: $ => seq(
      $.id, optional($.annot), choice($.dExpr, $.string, $.blob)
    ),
    multipleData: $ => seq(
      'begin',
      repeat(seq($.singleData, ';')),
      'end'
    ),
    dExpr: $ => seq('[', optional($.expr),']'),
    blob: $ => seq('{', optional($.annot), $.exprList, '}'),

    procedure: $ => seq(
      'proc', $.id,
      optional($.signature),
      optional($.vars),
      choice($.block, $.asm)
    ),
    vars: $ => seq(
      'var', $.declList
    ),
    declList: $ => seq(
      $.decl, repeat(seq(',', $.decl)), optional(',')
    ),
    decl: $ => seq($.idList, $.annot),
    annot: $ => seq(':', $.type),

    signature: $ => seq($.args, optional($.rets)),
    args: $ => seq(
      '[', optional($.declList),']'
    ),
    rets: $ => $.typeList,
    typeList: $ => seq(
      $.type, repeat(seq(',', $.type)), optional(',')
    ),

    type: $ => choice($.basicType, $.procType, $.name),
    procType: $ => seq(
      'proc', $.procTTList, $.procTTList
    ),
    procTTList: $ => seq('[', optional($.typeList), ']'),

    basicType: $ => choice(
      'i8', 'i16', 'i32', 'i64',
      'u8', 'u16', 'u32', 'u64',
      'ptr', 'bool', 'void'
    ),

    asm: $ => seq(
      'asm', optional($.clobberSet),
      'begin', repeat($.asmLine), 'end'
    ),
    clobberSet: $ => seq(
      '[', $.idList, ']'
    ),
    asmLine: $ => choice($.label, $.instruction),
    label: $ => seq('.', $.id, ':'),
    instruction: $ => seq($.instrName, optional($.opList), ';'),
    instrName: $ => $.id, // better highlighting
    opList: $ => seq(
      $.op, repeat(seq(',', $.op)), optional(',')
    ),
    op: $ => choice($.id, $.addressing, $.constOp, $.literal),
    addressing: $ => seq(
      '[', $.opList, ']', optional(seq('@', $.id))
    ),
    constOp: $ => seq('{', $.expr, '}'),

    block: $ => seq('begin', repeat($.statement),'end'),
    statement: $ => choice(
      seq($.If, optional(';')),
      seq($.While, optional(';')),
      seq($.DoWhile, optional(';')),
      seq($.Return, ';'),
      seq($.Set, ';'),
      seq($.Exit, ';'),
      seq($.expr, ';'),
    ),

    While: $ => seq(
      'while', $.expr, $.block
    ),
    DoWhile: $ => seq(
      'do', $.block, 'while', $.expr
    ),
    If: $ => seq(
      'if', $.expr, $.block,
      repeat($.Elseif), optional($.Else)
    ),
    Elseif: $ => seq(
      'elseif', $.expr, $.block
    ),
    Else: $ => seq(
      'else', $.block
    ),

  
    Return: $ => seq(
      'return', optional($.exprList)
    ),
    Exit: $ => seq(
      'exit', optional('?'), optional($.expr)
    ),
    Set: $ => seq(
      'set', $.exprList, choice($.assign, $.incDec) 
    ),
    incDec: $ => choice('++', '--'),
    assign: $ => seq($.assignOp, $.expr),
    assignOp: $ => choice(
      '=', '-=', '+=', '/=', '*=', '%=', '<>'
    ),

    exprList: $ => seq(
      $.expr, repeat(seq(',', $.expr)), optional(',')
    ),

    expr: $ => seq($._and, repeat(seq('or', $._and))),
    _and: $ => seq($._comp, repeat(seq('and', $._comp))),
    _comp: $ => seq($._sum, repeat(seq($.compOp, $._sum))),
    compOp: $ => choice('==', '!=', '>', '>=', '<', '<='),
    _sum: $ => seq($._mult, repeat(seq($.sumOp, $._mult))),
    sumOp: $ => choice(
      '+', '-', '|', '^',
    ),
    _mult: $ => seq($._unaryPrefix, repeat(seq($.multOp, $._unaryPrefix))),
    multOp: $ => choice(
      '*', '/', '%', '&', '<<', '>>'
    ),
    _unaryPrefix: $ => seq(repeat($.prefix), $._unarySuffix),
    _unarySuffix: $ => seq($.factor, repeat($.suffix)),
    prefix: $ => choice(
      'not', '~', '!'
    ),
    suffix: $ => choice(
      $.conversion,
      $.deref,
      $.call,
      $.dotAccess,
      $.arrowAccess
    ),
    conversion: $ => $.annot,
    call: $ => seq('[', optional($.exprList), ']'),
    deref: $ => seq('@', $.type),
    dotAccess: $ => seq('.', $.id),
    arrowAccess: $ => seq('->', $.id),

    factor: $ => choice(
      $.name, $.literal, $.nestedExpr, $.sizeof
    ),
    name: $ => seq($.id, optional(seq('::', $.id))),
    nestedExpr: $ => seq('(', $.expr, ')'),
    sizeof: $ => seq(
      'sizeof',
      '[', $.type, repeat($.suffix), ']'
    ),
    literal: $ => choice(
      'true', 'false', $.number, $.char
    ),
  
    id: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    digits: $ => /[0-9]/,
    decDigits: $ => /[0-9_]/,
    hexDigits: $ => /[0-9a-fA-F_]/,
    binDigits: $ => /[01_]/,
    numEnding: $ => choice(
      'p', 's', 'ss', 'l', 'll', 
      'u', 'us', 'uss', 'ul', 'ull',
    ),
    decimal: $ => seq(
      $.digits, repeat($.decDigits), optional($.numEnding),
    ),
    hexadecimal: $ => seq(
      '0x', $.hexDigits, repeat($.hexDigits), optional($.numEnding),
    ),
    binary: $ => seq(
      '0b', $.binDigits, repeat($.binDigits), optional($.numEnding),
    ),
    number: $ => choice(
      $.decimal, $.hexadecimal, $.binary
    ),

    escapes: $ => seq('\\', choice('"', "'", 'n', 't', 'r')),
    string: $ => seq('"', repeat(choice($.inStr, $.escapes)), '"'),
    inStr: $ => token.immediate(prec(1, /[^"\\]+/)),
    inChar: $ => token.immediate(prec(1, /[^"\\]/)),
    char: $ => seq("'", choice($.inChar, $.escapes), "'"),

    comment: $ => token(seq('#', /.*/))
  }
});
