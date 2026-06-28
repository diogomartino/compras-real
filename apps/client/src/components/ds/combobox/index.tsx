import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent
} from 'react';

type TComboboxOption = {
  value: string;
  label: string;
};

type TComboboxProps = {
  value: string;
  options: TComboboxOption[];
  placeholder?: string;
  emptyLabel?: string;
  createLabel?: (value: string) => string;
  allowCustomValue?: boolean;
  error?: string;
  className?: string;
  onChange: (value: string) => void;
};

type TComboboxOptionItemProps = {
  option: TComboboxOption;
  selected: boolean;
  onSelect: (value: string) => void;
};

type TComboboxCreateItemProps = {
  value: string;
  label: string;
  onSelect: (value: string) => void;
};

const defaultCreateLabel = (value: string) => `Create "${value}"`;

const ComboboxOptionItem = memo(
  ({ option, selected, onSelect }: TComboboxOptionItemProps) => {
    const checkClassName = useMemo(
      () => cn('size-4', selected ? 'opacity-100' : 'opacity-0'),
      [selected]
    );

    const select = useCallback(() => {
      onSelect(option.label);
    }, [onSelect, option.label]);

    return (
      <CommandItem key={option.value} value={option.value} onSelect={select}>
        <Check className={checkClassName} />
        {option.label}
      </CommandItem>
    );
  }
);

ComboboxOptionItem.displayName = 'ComboboxOptionItem';

const ComboboxCreateItem = memo(
  ({ value, label, onSelect }: TComboboxCreateItemProps) => {
    const select = useCallback(() => {
      onSelect(value);
    }, [onSelect, value]);

    return (
      <CommandItem value={value} onSelect={select}>
        <Plus className="size-4" />
        {label}
      </CommandItem>
    );
  }
);

ComboboxCreateItem.displayName = 'ComboboxCreateItem';

const Combobox = memo(
  ({
    value,
    options,
    placeholder,
    emptyLabel = 'No options found.',
    createLabel = defaultCreateLabel,
    allowCustomValue = false,
    error,
    className,
    onChange
  }: TComboboxProps) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setSearchValue(value);
    }, [value]);

    const normalizedSearchValue = useMemo(
      () => searchValue.trim().toLowerCase(),
      [searchValue]
    );
    const filteredOptions = useMemo(() => {
      if (!normalizedSearchValue) {
        return options;
      }

      return options.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearchValue)
      );
    }, [normalizedSearchValue, options]);

    const hasExactMatch = useMemo(
      () =>
        options.some(
          (option) => option.label.toLowerCase() === normalizedSearchValue
        ),
      [normalizedSearchValue, options]
    );

    const trimmedSearchValue = useMemo(() => searchValue.trim(), [searchValue]);
    const showCreateOption = useMemo(
      () => allowCustomValue && !!trimmedSearchValue && !hasExactMatch,
      [allowCustomValue, hasExactMatch, trimmedSearchValue]
    );
    const inputClassName = useMemo(
      () => cn('h-11 rounded-xl', className),
      [className]
    );
    const createOptionLabel = useMemo(
      () => createLabel(trimmedSearchValue),
      [createLabel, trimmedSearchValue]
    );

    const onInputFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
      event.target.select();
      setOpen(true);
    }, []);

    const onInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        setSearchValue(nextValue);
        setOpen(true);
        onChange(nextValue);
      },
      [onChange]
    );

    const selectValue = useCallback(
      (nextValue: string) => {
        setSearchValue(nextValue);
        onChange(nextValue);
        setOpen(false);
      },
      [onChange]
    );

    const onInteractOutside = useCallback((event: Event) => {
      const target = event.target;

      if (target instanceof Node && inputRef.current?.contains(target)) {
        event.preventDefault();
      }
    }, []);

    const onOpenAutoFocus = useCallback((event: Event) => {
      event.preventDefault();
    }, []);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <Input
            ref={inputRef}
            value={searchValue}
            error={error}
            onFocus={onInputFocus}
            onChange={onInputChange}
            className={inputClassName}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          onInteractOutside={onInteractOutside}
          onOpenAutoFocus={onOpenAutoFocus}
          className="w-[min(24rem,calc(100vw-2rem))] p-0"
        >
          <Command shouldFilter={false}>
            <CommandList>
              {filteredOptions.length === 0 && !showCreateOption && (
                <CommandEmpty>{emptyLabel}</CommandEmpty>
              )}
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <ComboboxOptionItem
                    key={option.value}
                    option={option}
                    selected={option.label === value}
                    onSelect={selectValue}
                  />
                ))}
                {showCreateOption && (
                  <ComboboxCreateItem
                    value={trimmedSearchValue}
                    label={createOptionLabel}
                    onSelect={selectValue}
                  />
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = 'Combobox';

export { Combobox };
export type { TComboboxOption, TComboboxProps };
