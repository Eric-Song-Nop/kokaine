import type { Component, JSX } from 'solid-js';

export type ResizerOrientation = 'horizontal' | 'vertical';

export interface DragResizerProps {
  orientation: ResizerOrientation;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  step?: number;
  inverted?: boolean;
  class?: string;
  onReset?: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const DragResizer: Component<DragResizerProps> = (props) => {
  let activePointer: number | undefined;
  let startCoordinate = 0;
  let startValue = 0;

  const coordinate = (event: PointerEvent) => (
    props.orientation === 'horizontal' ? event.clientY : event.clientX
  );

  const update = (value: number) => {
    const step = props.step ?? 1;
    const stepped = Math.round(value / step) * step;
    props.onChange(clamp(stepped, props.min, props.max));
  };

  const onPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    if (event.button !== 0) return;
    activePointer = event.pointerId;
    startCoordinate = coordinate(event);
    startValue = props.value;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = 'true';
    event.preventDefault();
  };

  const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    if (activePointer !== event.pointerId) return;
    const direction = props.inverted ? -1 : 1;
    update(startValue + ((coordinate(event) - startCoordinate) * direction));
  };

  const finishPointer: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    if (activePointer !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activePointer = undefined;
    delete event.currentTarget.dataset.dragging;
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    const step = props.step ?? 10;
    const direction = props.inverted ? -1 : 1;
    let next: number | undefined;

    if (event.key === 'Home') next = props.min;
    if (event.key === 'End') next = props.max;

    if (props.orientation === 'horizontal') {
      if (event.key === 'ArrowUp') next = props.value - (step * direction);
      if (event.key === 'ArrowDown') next = props.value + (step * direction);
    } else {
      if (event.key === 'ArrowLeft') next = props.value - (step * direction);
      if (event.key === 'ArrowRight') next = props.value + (step * direction);
    }

    if (next === undefined) return;
    event.preventDefault();
    update(next);
  };

  return (
    <div
      class={`kokaine-drag-resizer kokaine-drag-resizer--${props.orientation}${props.class ? ` ${props.class}` : ''}`}
      role="separator"
      aria-label={props.label}
      aria-orientation={props.orientation}
      aria-valuemin={props.min}
      aria-valuemax={props.max}
      aria-valuenow={Math.round(props.value)}
      aria-valuetext={`${Math.round(props.value)} pixels`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onLostPointerCapture={finishPointer}
      onKeyDown={onKeyDown}
      onDblClick={() => props.onReset?.()}
    >
      <span aria-hidden="true" />
    </div>
  );
};
