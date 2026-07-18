import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/jetbrains-mono';
import { render } from 'solid-js/web';
import { App } from './App';
import './styles.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Missing #app mount point.');
}

render(() => <App />, root);
