<header class="navbar">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">Mithril Boilerplate</a>
    </div>
    <nav>
      <ul class="nav navbar-nav">
        <li class={ctrl.tabActive('/')}><a href="/" config={m.route}>Home</a></li>
        <li class={ctrl.tabActive('/about')}><a href="/about" config={m.route}>About</a></li>
        <li><a href="https://github.com/ng-vu/mithril-boilerplate">GitHub</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="http://lhorie.github.io/mithril/">Mithril</a></li>
      </ul>
    </nav>
  </div>
</header>
