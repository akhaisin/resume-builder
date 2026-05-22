// minimal.typ
#let data = json(sys.inputs.at("data", default: "/data.json"))
#let basics = data.basics

#set page(margin: 1.2cm)
#set text(font: "Liberation Sans", size: 11pt)

#align(center)[
  #text(weight: 700, size: 20pt)[#basics.at("name", default: "Unnamed")]
  #linebreak()
  #basics.at("label", default: "")
]

#v(10pt)
#par(justify: true)[#basics.at("summary", default: "")]