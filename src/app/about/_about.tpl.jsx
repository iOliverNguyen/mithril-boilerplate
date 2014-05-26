<div class="about">
  <h3>About Mithril-Boilerplate</h3>
  <p>
    The project is a well structured boilerplate code for quickly starting new Mithril.js projects.<br/>
    For more information, browse <a href="https://github.com/ng-vu/mithril-boilerplate">project page</a> on GitHub.
  </p>
  <h3>Features</h3>
  <p>
    <ul>
      <li>Gulpfile</li>
      <li>Bower</li>
      <li>LESS & Bootstrap (easy to swap with your favourite tools)</li>
      <li>JSX (write HTML tags inside .jsx file)</li>
      <li>INCLUDE() JavaScript files</li>
      <li>Client side modules wrapped in CommonJs</li>
      <li>Watch with cache (only rebuild changed files)</li>
      <li>LiveReload</li>
      <li>Concat and minify stylesheets and scripts for production</li>
      <li>Unit testing will be supported soon</li>
    </ul>
  </p>
  <h3>Quick start</h3>
  <p>
    Make sure you have node and npm installed. Then
    <pre><code>
    npm install -g bower gulp http-server<br/><br/>

    git clone https://github.com/ng-vu/mithril-boilerplate.git<br/>
    cd mithril-boilerplate<br/><br/>

    npm install<br/>
    bower install<br/>
    gulp compile<br/>

    http-server build/public
    </code></pre>
  </p>
  <p>
    Running above commands compile source and put final code in these directories:
    <ul>
      <li><code>build</code> for development</li>
      <li><code>bin</code> for production</li>
    </ul>
  </p>
  <p>
    You may run the application by either of these commands:
    <pre><code>
    http-server build/public<br/>
    http-server bin/public
    </code></pre>
  </p>
  <p>
    To automatically build project whenever a source file changes:
    <pre><code>
    gulp build watch
    </code></pre>
  </p>
</div>
