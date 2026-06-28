import { memo, useCallback, useId } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

type TCheckProps = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const Check = memo(({ label, checked, onChange }: TCheckProps) => {
  const id = useId();
  const onCheckedChange = useCallback(
    (value: boolean | 'indeterminate') => {
      onChange?.(value === true);
    },
    [onChange]
  );

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="select-none cursor-pointer">
        {label}
      </Label>
    </div>
  );
});

Check.displayName = 'Check';

export { Check };
