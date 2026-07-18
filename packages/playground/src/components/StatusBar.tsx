import { CircleAlert, GitBranch, Radio } from 'lucide-solid';
import type { BuildStatus, LspStatus } from '../types';

interface StatusBarProps {
  lspStatus: LspStatus;
  buildStatus: BuildStatus;
  problems: number;
  line: number;
  column: number;
}

export function StatusBar(props: StatusBarProps) {
  return (
    <footer class="statusbar">
      <div>
        <span><GitBranch size={12} /> main.kk</span>
        <span class={`statusbar__lsp statusbar__lsp--${props.lspStatus}`}>
          <Radio size={12} /> Koka LSP {props.lspStatus}
        </span>
        <span><CircleAlert size={12} /> {props.problems}</span>
      </div>
      <div>
        <span>Ln {props.line}, Col {props.column}</span>
        <span>Spaces: 2</span>
        <span>{props.buildStatus === 'compiling' ? 'Compiling in WASM…' : 'Koka WASM'}</span>
      </div>
    </footer>
  );
}
