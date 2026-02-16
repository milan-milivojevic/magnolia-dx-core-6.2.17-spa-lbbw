import React from 'react';
import config from '../magnolia.config';
import { getAPIBase, getLanguages, removeCurrentLanguage, getCurrentLanguage, getVersion } from './AppHelpers';

import { EditablePage, EditorContextHelper } from '@magnolia/react-editor';

class PageLoader extends React.Component {
  state = {};

  getPagePath = () => {
    const languages = getLanguages();
    const nodeName = process.env.REACT_APP_MGNL_APP_BASE;
    const currentLanguage = getCurrentLanguage();

    let path = nodeName + this.props.pathname.replace(new RegExp('(.*' + nodeName + '|.html)', 'g'), '');

    
    languages.forEach((lang) => {
      path = removeCurrentLanguage(path, lang);
    });

    
    path += (path.includes('?') ? '&' : '?') + 'lang=' + currentLanguage;

    return path;
  };

  loadPage = async () => {
    
    if (this.state.pathname === this.props.pathname) return;

    const apiBase = getAPIBase();

    const pagePath = this.getPagePath();
    
    const config = {
      headers: {},
    };

    const isPersonalizationPage = sessionStorage.getItem(`personalized_${this.props.pathname.replace(/\//g, '_')}`);

    const params = new URLSearchParams(window.location.search);
    params.delete('lang');
    params.delete('mgnlLocale');

    const version = getVersion(window.location.href);

    if (version) {
      params.append('version', version);
    }

    if (params.get('mgnlPreviewAsVisitor') !== 'true' && EditorContextHelper.inIframe()) {
      params.append('variants', 'all');
    }

    const queryString = params.toString();

    const ageHeader = sessionStorage.getItem('mgnlAgeHeader');
    if (isPersonalizationPage && ageHeader && !EditorContextHelper.inIframe()) {
      config.headers['X-Mgnl-Age'] = ageHeader;
    }

    let fullContentPath = `${apiBase}${process.env.REACT_APP_MGNL_API_PAGES}${pagePath}`;

    if (queryString) {
      if (fullContentPath.includes('?')) {
        fullContentPath += '&';
      } else {
        fullContentPath += '?';
      }

      fullContentPath += queryString;
    }

    const pageResponse = await fetch(fullContentPath, config);
    const pageJson = await pageResponse.json();
    

    let templateJson = {};

    if (window.location.search.includes('mgnlPreview')) {
      const templateResponse = await fetch(apiBase + process.env.REACT_APP_MGNL_API_TEMPLATES + pagePath);
      templateJson = await templateResponse.json();
      
    }

    this.setState({
      init: true,
      content: pageJson,
      templateAnnotations: templateJson,
      pathname: this.props.pathname,
    });
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate() {
    this.loadPage();
  }

  render() {
    if (this.state.init) {
      
      
      return (
        <EditablePage
          templateAnnotations={this.state.templateAnnotations || {}}
          content={this.state.content}
          config={config}
        ></EditablePage>
      );
    } else {
      return <p></p>;
    }
  }
}

export default PageLoader;
