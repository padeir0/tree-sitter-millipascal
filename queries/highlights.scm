[
    "var"    "proc"   "begin"  "end"
    "while"  "if"     "else"   "elseif"
    "or"     "and"    "not"    "data"
    "exit"   "import" "from"   "export"
	  "const"  "sizeof" "return" "set"
	  "attr"   "as"     "is"     "all"
	  "type"   "asm"
] @keyword

(type) @type
(basicType) @type.builtin

[
  ":"
  ","
  ";"
  "::"
  "?"
  "^"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
	"="   "=="
	"!="  ">"   ">="  "<"   "<="
	"+"   "-"   "*"   "/"   "%"
  "+="  "-="  "*="  "/="  "%=" 
	"@"   "~"   "->"  "."
	"&&"  "||"  "!"   "|^"  ">>"  "<<"
] @operator

[
  (string)
] @string

[
  (number)
  (char)
  "true"
  "false"
] @constant

(comment) @comment
