[
    "var"    "proc"   "begin"  "end"
    "while"  "if"     "else"   "elseif"
    "or"     "and"    "not"    "data"
    "exit"   "import" "from"   "export"
	  "const"  "sizeof" "return" "set"
	  "attr"   "as"     "all"
	  "struct" "asm"    "do"
] @keyword

(type) @type
(basicType) @type.builtin

[
  ":"
  ","
  ";"
  "::"
  "?"
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
	"&"  "|"  "!"   "^"  ">>"  "<<"
	"<>" "++" "--"
] @operator

[
  (string)
] @string

[
  (char)
] @char

[
  (number)
  (char)
  "true"
  "false"
] @constant

(comment) @comment
(label) @label
(instrName) @function
