import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import meta from '@/data/meta';

const countries = ['singapore', 'sri-lanka', 'myanmar', 'bangladesh', 'pakistan', 'home'];

const Meta = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  let pathKey = '/' + parts.join('/');

  if (parts.length > 0 && countries.includes(parts[0])) {
    pathKey = '/' + parts.slice(1).join('/');
  }

  if (pathKey === '/' || pathKey === '') {
    pathKey = '/';
  }

  if (pathKey === '/home') {
    pathKey = '/';
  }

  const metaData = meta[pathKey] || meta['/'];

  useEffect(() => {
    document.title = metaData.title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', metaData.description);
    setMeta('keywords', metaData.keywords);
  }, [metaData]);

  return null;
};

export default Meta;
