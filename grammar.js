module.exports = grammar({
  name: 'millipascal',

   word: $ => $.id,
   rules: {
    source_file: $ => seq(
      repeat($.coupling),
      repeat($.symbol),
    ),
    coupling: $ => choice(
      $.import, $.fromImport, $.export
    ),
    symbol: $ => choice(
      $.procedure, $.memory, $.const
    ),

    import: $ => seq(
      'import', $.idList
    ),
    fromImport: $ => seq(
      'from', $.id, 'import', $.idList
    ),
    export: $ => seq(
      'export', $.idList
    ),
    idList: $ => seq(
      $.id, repeat(seq(',', $.id)), optional(',')
    ),

    const: $ => seq(
      'const', $.id, $.number,
    ),
    memory: $ => seq(
      'memory', $.id, choice($.number, $.string),
    ),

    procedure: $ => seq(
      'proc', $.id,
      optional(seq($.args, optional($.rets))),
      optional($.vars),
      $.block,
      'proc'
    ),
    args: $ => seq(
      '[', optional($.declList),']'
    ),
    vars: $ => seq(
      'var', $.declList
    ),
    rets: $ => $.typeList,
    typeList: $ => seq(
      $.type, repeat(seq(',', $.type)), optional(',')
    ),

    declList: $ => seq(
      $.decl, repeat(seq(',', $.decl)), optional(',')
    ),
    decl: $ => seq($.id, optional($.annot)),
    annot: $ => seq(':', $.type),

    type: $ => choice($.basicType, $.procType),
    procType: $ => prec.right(1, seq(
      'proc', '[', optional($.typeList), ']', optional($.procTypeRet)
    )),
    procTypeRet: $ => choice(
      seq('[', $.typeList, ']'),
      $.type,
    ),
    basicType: $ => choice(
      'i8', 'i16', 'i32', 'i64',
      'u8', 'u16', 'u32', 'u64',
      'ptr', 'bool'
    ),

    block: $ => seq('begin', repeat($.codeSemicolon),'end'),
    codeSemicolon: $ => seq($.code, optional(';')),
    code: $ => choice(
      $.If,
      $.While,
      $.Return,
      $.Set,
      $.Exit,
      $.expr,
    ),

    While: $ => seq(
      'while', $.expr, $.block, 'while'
    ),
    If: $ => seq(
      'if', $.expr, $.block,
      repeat($.Elseif), optional($.Else), 'if'
    ),
    Elseif: $ => seq(
      'elseif', $.expr, $.block
    ),
    Else: $ => seq(
      'else', $.block
    ),

    
    Return: $ => prec.right(1, seq(
      'return', optional($.exprList)
    )),
    Exit: $ => prec.right(1, seq(
      'exit', optional($.expr)
    )),
    Set: $ => seq(
      'set', $.exprList, $.assignOp, $.expr
    ),
    assignOp: $ => choice(
      '=', '-=', '+=', '/=', '*=', '%='
    ),

    exprList: $ => prec.right(1, seq(
      $.expr, repeat(seq(',', $.expr)), optional(',')
    )),

    expr: $ => seq($._and, repeat(seq('or', $._and))),
    _and: $ => seq($._comp, repeat(seq('and', $._comp))),
    _comp: $ => seq($._sum, repeat(seq($.compOp, $._sum))),
    compOp: $ => choice(
      '==', '!=', '>',
      '>=', '<', '<=',
    ),
    _sum: $ => seq($._mult, repeat(seq($.sumOp, $._mult))),
    sumOp: $ => choice(
      '+', '-', '||', '|^',
    ),
    _mult: $ => seq($._unaryPrefix, repeat(seq($.multOp, $._unaryPrefix))),
    multOp: $ => choice(
      '*', '/', '%', '&&', '<<', '>>'
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
      $.propertyAccess,
    ),
    conversion: $ => $.annot,
    call: $ => seq('[', optional($.exprList), ']'),
    deref: $ => seq('@', $.type),
    propertyAccess: $ => seq('.', $.id),

    factor: $ => choice(
      $.name, $.literal, $.nestedExpr,
      seq('sizeof', $.type),
    ),
    name: $ => seq($.id, optional(seq('::', $.id))),
    nestedExpr: $ => seq('(', $.expr, ')'),
    literal: $ => choice(
      'true', 'false', $.number, $.char
    ),
    
    id: $ => /[a-z_][a-zA-Z0-9_]*/,
    digits: $ => /[0-9]/,
    decDigits: $ => /[0-9_]/,
    hexDigits: $ => /[0-9a-fA-F_]/,
    binDigits: $ => /[01_]/,
    numEnding: $ => choice(
      'p', 's', 'ss', 'l', 'll', 
      'us', 'uss', 'ul', 'ull',
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

    escapes: $ => choice(
      '\\"', '\\\'', '\\n', '\\t', '\\r'
    ),
    string: $ => seq('"', repeat(choice($.inStr, $.escapes)), '"'),
    inStr: $ => /[^"\\]/,
    char: $ => seq("'", choice($.inStr, $.escapes), "'"),
  }
});
