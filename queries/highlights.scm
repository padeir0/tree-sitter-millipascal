[
    "var"    "proc"   "begin"  "end"
    "while"  "if"     "else"   "elseif"
    "or"     "and"    "not"    "memory"
    "exit"   "import" "from"   "export"
	  "const"  "sizeof" "return"
] @keyword

(type) @type
(basicType) @type.builtin

[
  ":"
  "."
  ","
  ";"
  "::"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

[

	"="   "=="  "!="  ">"   ">="  "<"
	"<="  "+"   "-"   "*"   "/"   "%"
	"-="  "+="  "*="  "/="  "%=" 
	"@"   "~"   "&&"  "||"  "!"
	"|^"  ">>"  "<<"
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
