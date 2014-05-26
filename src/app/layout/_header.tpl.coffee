m 'header.navbar' [
  m '.container' [
    m '.navbar-header' [
      m '.navbar-brand' {href:'/'} 'Mithril Boilerplate'
    ],
    m 'nav.nav.navbar-nav' [
      m 'li' {class:ctrl.tabActive('/')} [
        m 'a' {href='/', config:m.route}],
      m 'li' {class:ctrl.tabActive('/about')} [
        m 'a' {href='/about', config:m.route}]
      m 'li' [
        m 'a' {href:'https://github.com/ng-vu/mithril-boilerplate'} 'GitHub']
    ]
    m 'nav.nav.navbar-nav.navbar-right' [
      m 'li' [
        m 'a' {href='http://lhorie.github.io/mithril'} 'Mithril']
    ]
  ]
]
