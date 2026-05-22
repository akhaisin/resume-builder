// resume.typ — unified data-driven resume template (no flags, renders what is in the json)
// Input: --input data=<path-to-json>

// ── Data ──────────────────────────────────────────────────────────────────────
#let data      = json(sys.inputs.at("data", default: "/src/data/resume.json"))
#let basics    = data.basics
#let work      = data.at("work",      default: ())
#let education = data.at("education", default: ())
#let skills    = data.at("skills",    default: ())
#let cl_data   = basics.at("cover_letter", default: none)

#let has_header = basics.at("name", default: "") != ""
#let has_skills = skills.len() > 0
#let has_work   = work.len() > 0
#let has_edu    = education.len() > 0
#let has_cl     = cl_data != none and cl_data.len() > 0
#let has_resume = has_header or has_skills or has_work or has_edu

// ── Helpers ───────────────────────────────────────────────────────────────────
#let _months = ("Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

#let fmt_date(d) = {
  if d == none or d == "" { return "" }
  let p = d.split("-")
  if p.len() < 2 { return p.at(0) }
  _months.at(int(p.at(1)) - 1) + " " + p.at(0)
}

#let fmt_range(s, e) = {
  fmt_date(s) + " - " + if e == none or e == "" { "Present" } else { fmt_date(e) }
}

// ── Document setup ────────────────────────────────────────────────────────────
#let _name  = basics.at("name",  default: "")
#let _label = basics.at("label", default: "")

#set document(
  author: _name,
  title:  if _label != "" { _name + " - " + _label } else { _name },
)

#set text(
  font:      "Liberation Sans",
  size:      11pt,
  lang:      "en",
  region:    "US",
  hyphenate: false,
)

#set block(spacing: 0.8em, breakable: false)
#set par(justify: true)

#set page(
  margin: (top: 1.0cm, bottom: 2.0cm, left: 1.0cm, right: 1.0cm),
  footer: context align(right,
    counter(page).display("1 of 1", both: true)
  ),
)

#show link: set text(fill: rgb("#0645AD"))

#show heading: it => [
  #pad(top: 0pt, bottom: -15pt, [#smallcaps(it.body)])
  #line(length: 100%, stroke: 1pt)
]

// ── layout_header ─────────────────────────────────────────────────────────────
#let layout_header(name, label, contacts, summary) = {
  align(center)[
    #block(text(weight: 700, 2.0em, [#smallcaps(name)]))
  ]

  if label != "" {
    align(center)[#label]
  }

  if contacts.len() > 0 {
    pad(align(center)[#contacts.join("  |  ")])
  }

  if summary != "" [
    = Summary
    #summary
  ]
}

// ── render_header ─────────────────────────────────────────────────────────────
#let render_header() = {
  if not has_header { return }

  let phone = basics.at("phone", default: "")
  let email = basics.at("email", default: "")
  let url   = basics.at("url",   default: "")
  let contacts = {
    let c = ()
    if phone != "" { c.push([#phone]) }
    if email != "" { c.push([#link("mailto:" + email)[#email]]) }
    for p in basics.at("profiles", default: ()) {
      c.push([#link(p.url)[#p.url]])
    }
    if url != "" { c.push([#link(url)[#url]]) }
    c
  }
  let summary = basics.at("summary", default: "")

  layout_header(_name, _label, contacts, summary)
}

// ── render_skills ─────────────────────────────────────────────────────────────
#let render_skills() = {
  if not has_skills { return }

  heading(level: 1)[Skills]
  for s in skills {
    strong[#s.name: ]
    s.keywords.map(k => [#k]).join(" | ")
    linebreak()
  }
}

// ── layout_job ────────────────────────────────────────────────────────────────
#let layout_job(position, name, date, summary, location, highlights, is_short) = {
  let det = { for h in highlights [- #h
] }

  if is_short [
    #block(breakable: false, above: 1.2em,
      pad(bottom: 10%, {
        grid(
          columns: (auto, 1fr),
          align(left)[
            #strong[#position]
            #{ if summary != "" [ \ #emph[#summary] ] }
          ],
          align(right)[
            #emph[#date]
            #{ if location != "" [ \ #emph[#location] ] }
          ],
        )
        det
      })
    )
  ] else [
    #block(breakable: false, above: 1.2em,
      pad(bottom: 0%, {
        grid(
          columns: (auto, 1fr),
          align(left)[#strong[#position] | #emph[#name]],
          align(right)[#emph[#date]],
        )
        if summary != "" or location != "" [
          #grid(
            columns: (auto, 1fr),
            align(left)[#{ if summary  != "" [#strong[#summary]] }],
            align(right)[#{ if location != "" [#emph[#location]] }],
          )
        ]
        det
      })
    )
  ]
}

// ── render_exp ────────────────────────────────────────────────────────────────
#let render_exp() = {
  if not has_work { return }

  heading(level: 1)[Experience]
  for job in work {
    layout_job(
      job.position,
      job.at("name",       default: ""),
      fmt_range(job.at("startDate", default: ""), job.at("endDate", default: "")),
      job.at("summary",    default: ""),
      job.at("location",   default: ""),
      job.at("highlights", default: ()),
      job.at("short_exp",  default: false),
    )
  }
}

// ── layout_edu_group ──────────────────────────────────────────────────────────
#let layout_edu_group(institution, details, date_range, location, degrees) = {
  pad(
    bottom: 10%,
    grid(
      columns: (auto, 1fr),
      align(left)[
        #strong[#institution]
        #{ if details != "" [ \ #details] }
        \ #{
          linebreak()
          for degree in degrees [
            #strong[#degree.at(0)] | #emph[#degree.at(1)] \
          ]
        }
      ],
      align(right)[
        #emph[#date_range]
        #{ if location != "" [ \ #emph[#location] ] }
      ]
    )
  )
}

// ── render_edu ────────────────────────────────────────────────────────────────
#let render_edu() = {
  if not has_edu { return }

  heading(level: 1)[Education]
  let seen = ()
  for e in education {
    if not (e.institution in seen) {
      seen.push(e.institution)
      let group = education.filter(x => x.institution == e.institution)
      let first = group.at(0)
      layout_edu_group(
        first.institution,
        first.at("details",   default: ""),
        first.at("startDate", default: "") + " - " + first.at("endDate", default: ""),
        first.at("location",  default: ""),
        group.map(d => (d.studyType, d.area)),
      )
    }
  }
}

// ── render_cl_section ─────────────────────────────────────────────────────────
#let render_cl_section(section) = {

  let title    = section.at("title",  default: "")
  let sec_type = section.at("type",   default: "paragraphs")
  let items    = section.at("items",  default: ())

  if sec_type == "header" {
    heading(level: 1)[Cover Letter]
    align(right)[#items.join(linebreak())]
  } else {
    let inner = if sec_type == "paragraphs" {
      items.map(p => p.split("\n").map(l => [#l]).join(linebreak())).join(parbreak())
    } else if sec_type == "bullets" {
      list(..items.map(i => [#i]))
    } else { [] }

    if title != "" { [*#title*

#inner

] } else { [#inner

] }
  }
}

// ── render_cl ─────────────────────────────────────────────────────────────────
#let render_cl() = {
  if not has_cl { return }

  if has_resume { pagebreak() }

  for section in cl_data {
    render_cl_section(section)
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
#render_header()
#render_skills()
#render_exp()
#render_edu()
#render_cl()
