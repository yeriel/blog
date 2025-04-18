import { h } from 'hastscript'

export function GithubFolderComponent(properties, children) {
  if (Array.isArray(children) && children.length !== 0)
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("github-folder" directive must be leaf type)'
    ])

  const { repo, folder } = properties
  const cardUuid = `GF${Math.random().toString(36).slice(-6)}`

  const nTitle = h(`div`, { class: 'gc-titlebar' }, [
    h('div', { class: 'gc-titlebar-left' }, [
      h('div', { class: 'gc-owner' }, [
        h('div', { class: 'gc-folder-icon' }, [
          h('svg', { 
            viewBox: '0 0 24 24',
            width: '20',
            height: '20',
            fill: 'currentColor',
            style: 'margin-right: 6px;'
          }, [
            h('path', { 
              d: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'
            })
          ])
        ]),
        h('div', { class: 'gc-user' }, repo.split('/')[1]),
      ]),
      h('div', { class: 'gc-divider' }, '/'),
      h('div', { class: 'gc-repo' }, folder),
    ]),
    h('div', { class: 'github-logo' }),
  ])

  const nDescription = h(
    `div#${cardUuid}-description`,
    { class: 'gc-description' },
    [
      h('div', { 
        class: 'skeleton-loader', 
        style: 'width: 100%; height: 1.2em; margin-bottom: 0.3em' 
      }),
      h('div', { 
        class: 'skeleton-loader', 
        style: 'width: 80%; height: 1.2em' 
      })
    ]
  )

  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
      (function() {
        const cardEl = document.getElementById('${cardUuid}-card');
        const descEl = document.getElementById('${cardUuid}-description');

        fetch('https://raw.githubusercontent.com/${repo}/main/${folder}/README.md')
          .then(response => {
            if (!response.ok) throw new Error('HTTP Error: ' + response.status);
            return response.text();
          })
          .then(text => {
            const lines = text.split('\\n').map(line => line.trim());
            const firstDescLine = lines.find(line => 
              line !== '' && !line.startsWith('#')
            );
            
            const cleanDescription = firstDescLine 
              ? firstDescLine.replace(/:[a-zA-Z0-9_]+:/g, '').slice(0, 120)
              : 'Descripción no disponible';
            
            descEl.innerHTML = \`<p>\${cleanDescription}</p>\`;
            cardEl.classList.remove("fetch-waiting");
          })
          .catch(error => {
            console.error('GitHub Folder Error:', error);
            descEl.innerHTML = '<p>Error al cargar la descripción</p>';
            cardEl.classList.add("fetch-error");
          })
          .finally(() => {
            cardEl.classList.remove("fetch-waiting");
          });
      })();
    `
  )

  return h(
    `a#${cardUuid}-card`,
    {
      class: 'card-github fetch-waiting no-styling',
      href: `https://github.com/${repo}/tree/main/${folder}`,
      target: '_blank',
      'data-repo': repo,
      'data-folder': folder
    },
    [
      nTitle,
      nDescription,
      nScript
    ]
  )
}
