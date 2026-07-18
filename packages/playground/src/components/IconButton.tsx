import { splitProps, type JSX } from 'solid-js';

interface IconButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  label: string;
  children: JSX.Element;
  variant?: 'ghost' | 'quiet' | 'primary';
  compact?: boolean;
}

export function IconButton(props: IconButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    'label',
    'children',
    'variant',
    'compact',
    'class',
  ]);
  const variant = () => local.variant ?? 'ghost';
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      class={`icon-button icon-button--${variant()}${local.compact ? ' icon-button--compact' : ''} ${local.class ?? ''}`}
      title={local.label}
      aria-label={local.label}
    >
      {local.children}
    </button>
  );
}
