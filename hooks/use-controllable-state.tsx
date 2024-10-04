import { useCallback, useEffect, useRef, useState } from 'react';

interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export default function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (newValue: T) => void] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const state = isControlled ? value : internalValue;

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setState = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onChangeRef.current) {
        onChangeRef.current(newValue);
      }
    },
    [isControlled]
  );

  return [state as T, setState];
}
