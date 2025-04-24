<div align="center">
        <img width="120px" height="auto" src="https://raw.githubusercontent.com/jamesgober/jamesgober/main/media/icons/hexagon-3.svg" alt="Triple Hexagon">
    <h1>
        <strong>EVENT FLOW</strong>
        <br>
        <sub>
            <sup>
                JAVASCRIPT EVENT MANAGER
            </sup>
        </sub>
        <br>
    </h1>
    <p>
        Centralized, memory-safe event management for modern JavaScript applications — with throttling, debouncing namespaces, and full observer support.
    </p>
    <br>
    <div>
  <!-- NPM version -->
        <a href="https://www.npmjs.com/package/@jamesgober/eventflow" alt="NPM Version">
            <img src="https://img.shields.io/npm/v/@jamesgober/eventflow.svg" alt="NPM Version">
        </a>
        <span>&nbsp;</span>
        <!-- NPM downloads -->
        <a href="https://www.npmjs.com/package/@jamesgober/eventflow" alt="NPM Downloads">
            <img src="https://img.shields.io/npm/dm/@jamesgober/eventflow.svg" alt="NPM Downloads">
        </a>
        <span>&nbsp;</span>
        <!-- BCommonJS Badge -->
        <img src="https://img.shields.io/badge/module-CJS-informational" alt="CommonJS Badge">
        <span>&nbsp;</span>
        <img alt="GitHub" src="https://img.shields.io/github/license/jamesgober/event-flow">
    </div>
</div>

<br>
<p>
    <strong>EventFlow</strong> is a high-performance, memory-efficient event management layer built to replace messy DOM bindings and tangled listener logic. 
    Instead of scattering <code>addEventListener</code> all over your UI, EventFlow gives you a centralized, declarative system for managing app-wide events with namespaces, throttling, debouncing, and observer support built right in.
</p>
<p>
    Ideal for reactive designs/interfaces, modular UIs, and JavaScript apps that demand control and consistency, EventFlow gives you the speed and structure of an event bus—without the bulk of bloated frameworks or the chaos of raw DOM wiring.
</p>
<br>

<h2>Features</h2>
<ul>
    <li>
        Centralized event management
    </i>
    <li>
        <code>once</code>, <code>throttle</code>, and <code>debounce</code> support
    </i>
    <li>
        Namespaced event listeners (<code>on('click', fn, { namespace: 'ui' })</code>)  
    </i>
    <li>
        Observer pattern (<code>observe</code>, <code>unobserve</code>)  
    </i>
    <li>
        Full test coverage (Jest)  
    </i>
    <li>
        No DOM pollution — pure logic, clean memory  
    </i>
    <li>
        Built-in error protection with <code>doEvent</code>
    </i>
    <li>
        Works in <b>Node.js</b>, <b>Browser</b>, <b>JSDOM</b>, and <b>Hybrid environments</b>
    </i>
</ul>

<br>

---

<h2>Usage</h2>

<p>
    <i>Install using npm</i>
</p>

```bash
npm install @jamesgober/eventflow
```

<h3>Running Tests</h3>

```bash
npm run test
npm run coverage
```

<h3>Documentation</h3>

```bash
npm run docs
```

<br>

<h3>Basic Usage</h3>

```js
const EventFlow = require('@jamesgober/eventflow'); // or import if you use ESM
const events = new EventFlow({ debug: true });

events.on('save', () => console.log('Saved!'));
events.emit('save');

events.on('scroll', () => console.log('Scrolled!'), { throttle: 250 });
events.on('submit', () => console.log('Form submitted!'), { once: true });
```

<br>
<h4>Observers (reactive-style):</h4>

```js
events.observe('message', (data) => {
  console.log('New message received:', data);
});

events.emit('message', { id: 1, text: 'Hello world' });
```

<br>

<h3>API Summary</h3>
<table>
    <thead>
        <tr>
            <th><h4>Method</h4></th>
            <th><h4>Description</h4></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>on()</code></td>
            <td>Register an event listener with optional modifiers</th>
        </tr>
        <tr>
            <td><code>off()</code></td>
            <td>Remove a listener by reference</td>
        </tr>
        <tr>
            <td><code>emit()</code></td>
            <td>Trigger an event with optional arguments</td>
        </tr>
        <tr>
            <td><code>observe()</code></td>
            <td>Register an observer that watches all emits</td>
        </tr>
        <tr>
            <td><code>unobserve()</code></td>
            <td>Remove an observer from an event</td>
        </tr>
            <td><code>_throttle()</code></td>
            <td>Internal helper for throttling</td>
        </tr>
        <tr>
            <td><code>_debounce()</code></td>
            <td>Internal helper for debouncing</td>
        </tr>
        <tr>
            <td><code>_applyModifiers()</code></td>
            <td>Wraps listeners with debounce/throttle/once logic</td>
        </tr>
    </tbody>
</table>


<br>


<!-- LICENSE
============================================================================ -->
<div id="license">
    <br><hr>
    <h2>License</h2>
    <p>This is an open-source project licensed under the <b>MIT</b> license.</p>
    <p>All rights not explicitly granted in the MIT license are reserved. You may obtain a copy of the 
    <b>License</b> at: 
    <a href="https://opensource.org/licenses/MIT" title="MIT License" target="_blank">https://opensource.org/licenses/MIT</a>.
    </p>
    <p>Unless required by applicable law or agreed to in writing, software distributed under the <b>License</b> is distributed on an "<b>AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND</b>, either express or implied.</p>
    <br><p>See the <a href="./LICENSE" title="Software License file">LICENSE</a> file included with this project for the specific language governing permissions and limitations under the <b>License</b>.</p>
    <br>
</div>


<br>

<!-- COPYRIGHT
============================================================================ -->
<div align="center">
  <br>
  <h2></h2>
  <sup>COPYRIGHT <small>&copy;</small> 2025 <strong>JAMES GOBER.</strong></sup>
</div>