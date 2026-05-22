// demo.typ
#let data = json(sys.inputs.at("data", default: "/data.json"))
#let basics = data.basics
#let work = data.at("work", default: ())

#set page(margin: 1cm)
#set text(font: "Liberation Sans", size: 10.5pt)

= #basics.at("name", default: "Demo Resume")

#if basics.at("label", default: "") != "" [
  #emph[#basics.at("label")]
]

#if basics.at("summary", default: "") != "" [
  #v(8pt)
  #basics.at("summary")
]

#if work.len() > 0 [
  #v(12pt)
  == Experience
  #for job in work [
    #strong[#job.at("position", default: "Role")]
    #if job.at("name", default: "") != "" [ at #job.at("name") ]
    #linebreak()
    #job.at("summary", default: "")
    #v(6pt)
  ]
]