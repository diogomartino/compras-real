import { AppBottomNav } from '@/components/app-bottom-nav';
import { ActionTile, Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListChecks, Plus, Search, Sparkles } from 'lucide-react';
import {
  memo,
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const HomeDashboard = memo(() => {
  const [quickItem, setQuickItem] = useState('');
  const navigate = useNavigate();

  const reviewList = useCallback(() => {
    navigate('/base-list');
  }, [navigate]);

  const addItem = useCallback(() => {
    navigate('/base-list');
  }, [navigate]);

  const onQuickItemChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuickItem(event.target.value);
    },
    []
  );

  const submitQuickAdd = useCallback(() => {
    if (!quickItem.trim()) {
      toast.message('Type an item to add later.');
      return;
    }

    toast.info('Quick add is visual only for now.');
  }, [quickItem]);

  const onQuickSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitQuickAdd();
    },
    [submitQuickAdd]
  );

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface variant="default" radius="2xl" padding="md">
          <Stack gap="md">
            <Inline gap="sm" wrap={false}>
              <div className="grid size-10 place-items-center rounded-xl bg-muted text-primary">
                <Sparkles className="size-5" />
              </div>
              <Stack gap="none">
                <Text weight="semibold">Quick add</Text>
                <Text size="sm" tone="muted">
                  Capture groceries during the week.
                </Text>
              </Stack>
            </Inline>

            <form className="flex gap-2" onSubmit={onQuickSubmit}>
              <Input
                value={quickItem}
                onChange={onQuickItemChange}
                onEnter={submitQuickAdd}
                className="h-12 rounded-2xl bg-background"
                placeholder="Milk, bread, bananas..."
              />
              <Button className="h-12 rounded-2xl px-4" type="submit">
                <Plus className="size-5" />
                <span className="sr-only sm:not-sr-only">Add</span>
              </Button>
            </form>
          </Stack>
        </Surface>

        <section className="grid gap-3 sm:grid-cols-2">
          <ActionTile
            icon={<Plus className="size-5" />}
            title="Add item"
            description="Open the fuller add flow for quantities and notes."
            variant="primary"
            onClick={addItem}
          />
          <ActionTile
            icon={<ListChecks className="size-5" />}
            title="Review list"
            description="Prepare the current list before shopping."
            onClick={reviewList}
          />
        </section>

        <Surface variant="muted" radius="2xl" padding="md">
          <Inline justify="between" wrap={false}>
            <Stack gap="xs">
              <Text weight="semibold">Today's focus</Text>
              <Text size="sm" tone="muted">
                Shopping, quick adding, and list review are the only home
                actions for this first pass.
              </Text>
            </Stack>
            <Search className="size-5 shrink-0 text-muted-foreground" />
          </Inline>
        </Surface>
      </div>

      <AppBottomNav />
    </main>
  );
});

HomeDashboard.displayName = 'HomeDashboard';

export { HomeDashboard };
