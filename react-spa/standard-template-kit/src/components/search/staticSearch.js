import React, { useState, useEffect } from 'react';
import { getAPIBase } from '../../helpers/AppHelpers';
import '../../css.css';
import { ReactComponent as ArrowsIcon } from '../../images/home/ArrowsIcon.svg';
import ClipLoader from 'react-spinners/ClipLoader';


const makeHighlighter = (term) => {
  const re = new RegExp(`(${term})`, 'gi');

  return (html) => {
    if (!term || !html) return { html: '', hasMark: false };

    const doc = new DOMParser().parseFromString(html, 'text/html');

    
    (function walk(node) {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(re);
        if (parts.length > 1) {
          const frag = new DocumentFragment();
          parts.forEach((p) =>
            frag.appendChild(
              re.test(p)
                ? Object.assign(document.createElement('mark'), { textContent: p })
                : document.createTextNode(p)
            )
          );
          node.replaceWith(frag);
        }
      } else Array.from(node.childNodes).forEach(walk);
    })(doc.body);

    
    doc.querySelectorAll('p').forEach((p) => {
      if (!p.innerHTML.includes('<mark')) p.remove();
    });

    
    doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      if (h.innerHTML.includes('<mark')) return;
      let sib = h.nextElementSibling,
        keep = false;
      while (sib) {
        if (sib.innerHTML?.includes('<mark')) {
          keep = true;
          break;
        }
        sib = sib.nextElementSibling;
      }
      if (!keep) h.remove();
    });

    const out = doc.body.innerHTML;
    return { html: out, hasMark: out.includes('<mark') };
  };
};


function StaticSearch({ globalQuery }) {
  const apiBase = getAPIBase();
  const restPath = process.env.REACT_APP_MGNL_API_SEARCH;

  const [descArr, setDescArr] = useState([]);
  const [headArr, setHeadArr] = useState([]);
  const [titleArr, setTitleArr] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!globalQuery || globalQuery.length < 2) {
      setQuery('');
      setDescArr([]);
      setHeadArr([]);
      setTitleArr([]);
      setLoading(false);
      return;
    }
    setQuery(globalQuery);
    fetchData(globalQuery);
  }, [globalQuery]);

  
  const fetchData = (q) => {
    setLoading(true);

    const url =
      `${apiBase}${restPath}?q=${encodeURIComponent(q)}*` +
      `&nodeTypes=mgnl:page,mgnl:component&limit=1000`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ results = [] }) => {
        setDescArr(results.filter((r) => r.description));
        setHeadArr(results.filter((r) => r.headline));
        setTitleArr(results.filter((r) => r.title));
      })
      .catch(() => {
        setDescArr([]);
        setHeadArr([]);
        setTitleArr([]);
      })
      .finally(() => setLoading(false));
  };

  
  const uniq = [...descArr, ...headArr, ...titleArr].filter(
    (n, i, a) => i === a.findIndex((t) => t['@id'] === n['@id'])
  );

  const highlight = makeHighlighter(query);

  
  const ordered = uniq
    .map((d) => {
      const makeEntry = (path, baseName, anchor = null) => {
        const { html: descHTML, hasMark: markDesc } = highlight(
          d.description || ''
        );
        const { html: titleHTML, hasMark: markTitle } = highlight(
          d.headline || d.title || ''
        );

        
        if (!markDesc && !markTitle) return null;

        const linkLabel = anchor ? `${baseName}#${anchor}` : baseName;

        return {
          id: d['@id'],
          path,
          page: linkLabel,
          description: descHTML,
          title: titleHTML,
          markDesc,
          markTitle,
        };
      };

      const p = d['@path'];
      const mIdx = p.indexOf('/mainSection');
      const bIdx = p.indexOf('/bannerSection');

      if (mIdx !== -1) {
        const base = p.slice(0, mIdx);
        const last = base.split('/').pop();
        const anchor = d.navigationId || null;
        return makeEntry(anchor ? `${base}#${anchor}` : base, last, anchor);
      }
      if (bIdx !== -1) {
        const base = p.slice(0, bIdx);
        const last = base.split('/').pop();
        return makeEntry(base, last);
      }
      const parts = p.split('/');
      let fullPath = p;
      if (d.componentId) {
        const cut = p.lastIndexOf('/');
        fullPath = `${p.slice(0, cut)}#${p.slice(cut + 1)}`;
      }
      const last = parts.pop();
      return makeEntry(fullPath, last);
    })
    .filter(Boolean); 

  
  const filtered = ordered.filter(
    (o) =>
      !o.path.includes('/Config-Pages/') &&
      !o.path.includes('/Components-Library/')
  );

  
  const grouped = [];
  filtered.forEach((o) => {
    const descPlain = (o.description || '').replace(/<[^>]*>/g, '').trim();
    if (!descPlain) return; 

    const ex = grouped.find((x) => x.path === o.path);
    if (ex) {
      
      const dup = [...Array(ex.count)].some(
        (_, i) =>
          ex[`title${i + 1}`] === o.title &&
          ex[`description${i + 1}`] === o.description
      );
      if (!dup) {
        const idx = ++ex.count;
        ex[`title${idx}`] = o.title;
        ex[`description${idx}`] = o.description;
      }
    } else {
      grouped.push({
        id: o.id,
        page: o.page,
        path: o.path,
        title1: o.title,
        description1: o.description,
        count: 1,
      });
    }
  });

  
  if (loading) {
    return (
      <div className="staticSearch search-spinner">
        <ClipLoader
          loading
          size={50}
          color="#3aaa35"
          cssOverride={{ borderWidth: '3px' }} 
        />
      </div>
    );
  }

  if (!grouped.length) {
    return (
      <p className="staticSearch no-results">
        Es wurden keine Ergebnisse für den Suchbegriff „{query}“ gefunden.
      </p>
    );
  }

  return (
    <div className="flexColumn staticSearch">
      {grouped.map((item) => (
        <ul className="list" key={item.id}>
          <li className="page">
            <a href={`${apiBase}${item.path}`}>
              {item.page} <ArrowsIcon />
            </a>
          </li>
          {Array.from({ length: item.count }, (_, i) => (
            <React.Fragment key={i}>
              <li className="title">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: item[`title${i + 1}`] || '',
                  }}
                />
              </li>
              <li
                className="description"
                dangerouslySetInnerHTML={{
                  __html: item[`description${i + 1}`] || '',
                }}
              />
            </React.Fragment>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default StaticSearch;
