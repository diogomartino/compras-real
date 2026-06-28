import {
  ActionTile,
  BottomActionBar,
  EmptyState,
  Field,
  Grid,
  Heading,
  Inline,
  Kbd,
  ListRow,
  Media,
  PageShell,
  ProgressSummary,
  Section,
  Stack,
  Stat,
  StatusChip,
  Surface,
  Text,
  Toolbar
} from '@/components/ds';
import { Layout } from '@/components/layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Archive,
  Check,
  Filter,
  History,
  Home,
  Inbox,
  ListChecks,
  PackagePlus,
  Plus,
  Search,
  ShoppingBasket,
  SkipForward,
  Sparkles,
  Tags,
  Undo2
} from 'lucide-react';
import { memo } from 'react';

const pageShellSizes = ['sm', 'md', 'lg', 'full'] as const;
const pageShellSpacings = ['sm', 'md', 'lg'] as const;
const sectionVariants = ['default', 'muted', 'bordered'] as const;
const sectionSpacings = ['sm', 'md', 'lg'] as const;
const surfaceVariants = [
  'default',
  'muted',
  'outline',
  'elevated',
  'ghost'
] as const;
const surfacePaddings = ['none', 'sm', 'md', 'lg'] as const;
const surfaceRadii = ['md', 'lg', 'xl', '2xl'] as const;
const stackGaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
const inlineGaps = ['none', 'xs', 'sm', 'md', 'lg'] as const;
const alignVariants = ['start', 'center', 'end', 'stretch'] as const;
const justifyVariants = ['start', 'center', 'end', 'between'] as const;
const gridColumns = ['one', 'two', 'three', 'four', 'auto'] as const;
const gridGaps = ['sm', 'md', 'lg'] as const;
const headingSizes = ['display', 'h1', 'h2', 'h3', 'h4'] as const;
const headingTones = ['default', 'muted'] as const;
const textSizes = ['xs', 'sm', 'md', 'lg'] as const;
const textTones = ['default', 'muted', 'subtle', 'destructive'] as const;
const textWeights = ['normal', 'medium', 'semibold'] as const;
const mediaSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const mediaShapes = ['square', 'circle', 'soft'] as const;
const statusTones = [
  'neutral',
  'muted',
  'pending',
  'success',
  'skipped',
  'info',
  'destructive'
] as const;
const statusSizes = ['sm', 'md', 'lg'] as const;
const listRowVariants = ['default', 'muted', 'ghost', 'selected'] as const;
const listRowSizes = ['sm', 'md', 'lg'] as const;
const progressSizes = ['sm', 'md', 'lg'] as const;
const progressTones = ['default', 'muted', 'success', 'warn'] as const;
const bottomPositions = ['static', 'sticky', 'fixed'] as const;
const bottomLayouts = ['single', 'split', 'auto'] as const;
const actionTileVariants = ['default', 'muted', 'primary', 'outline'] as const;
const actionTileSizes = ['sm', 'md', 'lg'] as const;
const toolbarVariants = ['default', 'muted', 'plain'] as const;
const toolbarAligns = ['start', 'center', 'end'] as const;
const fieldLayouts = ['stack', 'inline'] as const;
const emptyStateVariants = ['default', 'muted', 'plain'] as const;
const emptyStateSizes = ['sm', 'md', 'lg'] as const;
const statTones = [
  'default',
  'muted',
  'success',
  'warn',
  'destructive'
] as const;
const kbdSizes = ['sm', 'md', 'lg'] as const;

const Ds = memo(() => {
  return (
    <Layout className="p-0">
      <PageShell
        eyebrow="Design System"
        title="Grocery-ready primitives"
        description="A calm, light-first set of reusable primitives for quick weekly list management and focused one-handed shopping. Examples use grocery content, but component names and APIs stay generic."
        actions={
          <Button size="sm">
            <Plus />
            Add item
          </Button>
        }
        size="lg"
        spacing="lg"
      >
        <Section
          title="App foundations"
          description="Dashboard, list management, and shopping mode can be composed from the same small primitives."
          variant="bordered"
          spacing="lg"
        >
          <Grid columns="three" gap="lg">
            <Stat
              label="Base list"
              value="18"
              description="Always included"
              tone="default"
            />
            <Stat
              label="Ongoing list"
              value="5"
              description="Added this week"
              tone="success"
              trend={
                <span className="text-green-700 dark:text-green-300">
                  Ready
                </span>
              }
            />
            <Stat
              label="Shopping"
              value="8 / 23"
              description="Current progress"
              tone="warn"
            />
          </Grid>

          <Grid columns="three" gap="lg">
            <ActionTile
              icon={<ShoppingBasket className="size-5" />}
              title="Start shopping"
              description="Large, calm action for the most important flow."
              variant="primary"
              meta={<StatusChip tone="pending">23 items</StatusChip>}
            />
            <ActionTile
              icon={<PackagePlus className="size-5" />}
              title="Product catalog"
              description="Manage products, images, quantities, and categories."
              variant="default"
            />
            <ActionTile
              icon={<History className="size-5" />}
              title="History"
              description="Review completed shopping trips."
              variant="muted"
            />
          </Grid>
        </Section>

        <Section
          title="Management toolbar"
          description="Search, filter, and action areas stay stacked on mobile and inline on desktop."
          variant="default"
          spacing="lg"
        >
          <Toolbar
            search={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search products" />
              </div>
            }
            filters={
              <>
                <Button variant="outline" size="sm">
                  <Filter />
                  Dairy
                </Button>
                <Button variant="outline" size="sm">
                  <Tags />
                  Uncategorized
                </Button>
              </>
            }
            actions={
              <Button size="sm">
                <Plus />
                Add product
              </Button>
            }
          />
        </Section>

        <Section
          title="Media and rows"
          description="Image and row primitives support catalog cards, grouped lists, and shopping rows without semantic coupling."
          variant="muted"
          spacing="lg"
        >
          <Grid columns="two" gap="lg">
            <Surface variant="default">
              <Stack gap="md">
                <Inline gap="sm" align="center">
                  {mediaSizes.map((size) => (
                    <Media
                      key={size}
                      size={size}
                      fallback={size.toUpperCase()}
                    />
                  ))}
                </Inline>
                <Inline gap="sm" align="center">
                  {mediaShapes.map((shape) => (
                    <Media
                      key={shape}
                      shape={shape}
                      fallback={shape.slice(0, 1).toUpperCase()}
                    />
                  ))}
                </Inline>
              </Stack>
            </Surface>

            <Surface variant="default">
              <Stack gap="sm">
                <ListRow
                  leading={<Media fallback="M" />}
                  title="Milk"
                  description="Dairy · default quantity"
                  meta={<StatusChip tone="info">Base</StatusChip>}
                  trailing={<Text weight="semibold">2 units</Text>}
                />
                <ListRow
                  leading={<Media fallback="C" />}
                  title="Coca-Cola Zero"
                  description="Drinks · added during the week"
                  meta={<StatusChip tone="pending">Pending</StatusChip>}
                  trailing={<Text weight="semibold">6 bottles</Text>}
                  variant="selected"
                />
              </Stack>
            </Surface>
          </Grid>

          <Grid columns="four">
            {listRowVariants.map((variant) => (
              <ListRow
                key={variant}
                leading={
                  <Media
                    size="sm"
                    fallback={variant.slice(0, 1).toUpperCase()}
                  />
                }
                title={`Row ${variant}`}
                description="Variant preview"
                trailing={<StatusChip tone="muted">2 kg</StatusChip>}
                variant={variant}
              />
            ))}
          </Grid>

          <Grid columns="three">
            {listRowSizes.map((size) => (
              <ListRow
                key={size}
                leading={<Media size="sm" fallback={size.toUpperCase()} />}
                title={`Row ${size}`}
                description="Size preview"
                trailing={<StatusChip tone="neutral">1 box</StatusChip>}
                size={size}
              />
            ))}
          </Grid>
        </Section>

        <Section
          title="Shopping mode composition"
          description="Focused, thumb-first primitives for list and swipe-style shopping without creating feature-specific components."
          variant="bordered"
          spacing="lg"
        >
          <Grid columns="two" gap="lg">
            <Surface
              variant="elevated"
              padding="lg"
              className="overflow-hidden"
            >
              <Stack gap="lg">
                <ProgressSummary
                  label="Shopping progress"
                  value="8 / 23"
                  progress={35}
                  size="lg"
                />
                <Stack gap="sm">
                  <ListRow
                    leading={<Media size="lg" fallback="E" />}
                    title="Eggs"
                    description="Dairy · check the fragile shelf"
                    meta={
                      <StatusChip tone="pending" size="md">
                        Pending
                      </StatusChip>
                    }
                    trailing={<Text weight="semibold">2 packs</Text>}
                    actions={
                      <Inline gap="sm">
                        <Button size="sm">
                          <Check />
                          Done
                        </Button>
                        <Button size="sm" variant="outline">
                          <SkipForward />
                          Skip
                        </Button>
                      </Inline>
                    }
                    size="lg"
                  />
                  <ListRow
                    leading={<Media fallback="T" />}
                    title="Toilet paper"
                    description="Cleaning"
                    meta={<StatusChip tone="success">Done</StatusChip>}
                    trailing={
                      <Button size="sm" variant="ghost">
                        <Undo2 />
                        Undo
                      </Button>
                    }
                    variant="muted"
                  />
                  <ListRow
                    leading={<Media fallback="B" />}
                    title="Chicken breast"
                    description="Meat"
                    meta={<StatusChip tone="skipped">Skipped</StatusChip>}
                    trailing={
                      <Button size="sm" variant="ghost">
                        <Undo2 />
                        Undo
                      </Button>
                    }
                    variant="ghost"
                  />
                </Stack>
              </Stack>
            </Surface>

            <Surface variant="elevated" padding="lg">
              <Stack gap="lg" align="stretch">
                <Inline justify="between" wrap={false}>
                  <StatusChip tone="info" size="md">
                    Swipe view
                  </StatusChip>
                  <Text size="sm" tone="muted">
                    9 / 23
                  </Text>
                </Inline>
                <Media
                  size="xl"
                  shape="soft"
                  fallback={<ShoppingBasket className="size-8" />}
                  className="mx-auto size-40"
                />
                <Stack gap="sm" align="center">
                  <Heading level={3} size="h2" className="text-center">
                    Dishwasher tablets
                  </Heading>
                  <Inline gap="sm" justify="center">
                    <StatusChip tone="muted">Cleaning</StatusChip>
                    <StatusChip tone="neutral">1 box</StatusChip>
                  </Inline>
                </Stack>
                <ProgressSummary progress={39} tone="success" />
                <BottomActionBar
                  position="static"
                  layout="split"
                  className="rounded-2xl"
                >
                  <Button size="lg" variant="outline">
                    <SkipForward />
                    Skip
                  </Button>
                  <Button size="lg">
                    <Check />
                    Done
                  </Button>
                </BottomActionBar>
              </Stack>
            </Surface>
          </Grid>
        </Section>

        <Section
          title="Forms and future placeholders"
          description="Generic form fields support catalog setup, quantity editing, disabled future actions, and URL import placeholders."
          variant="default"
          spacing="lg"
        >
          <Grid columns="two" gap="lg">
            <Stack gap="md">
              <Field
                label="Name"
                description="Short names scan best in the shop."
                required
              >
                <Input placeholder="Coca-Cola Zero" />
              </Field>
              <Field label="Category">
                <Select defaultValue="drinks">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Default quantity"
                description="Adjustable when adding to a list."
              >
                <Inline gap="sm" wrap={false}>
                  <Input defaultValue="6" type="number" />
                  <Select defaultValue="bottles">
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">units</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="packs">packs</SelectItem>
                      <SelectItem value="bottles">bottles</SelectItem>
                    </SelectContent>
                  </Select>
                </Inline>
              </Field>
            </Stack>

            <Stack gap="md">
              {fieldLayouts.map((layout) => (
                <Field
                  key={layout}
                  label={`Field ${layout}`}
                  description="Layout variant preview."
                  layout={layout}
                >
                  <Input placeholder="Preview" />
                </Field>
              ))}
              <Field
                label="Product URL"
                description="Import can exist before it works."
                error="Import is not implemented yet."
              >
                <Inline gap="sm" wrap={false}>
                  <Input placeholder="https://example.com/product" />
                  <Button variant="outline" disabled>
                    <Sparkles />
                    Later
                  </Button>
                </Inline>
              </Field>
              <Surface variant="outline">
                <Stack gap="sm">
                  <Inline justify="between" wrap={false}>
                    <Text weight="medium">Archive product</Text>
                    <Switch />
                  </Inline>
                  <Inline gap="sm">
                    <Checkbox defaultChecked />
                    <Text size="sm" tone="muted">
                      Keep old history visible
                    </Text>
                  </Inline>
                  <Slider
                    defaultValue={[60]}
                    rightSlot={<Text size="sm">60%</Text>}
                  />
                </Stack>
              </Surface>
            </Stack>
          </Grid>
        </Section>

        <Section
          title="Feedback"
          description="Quiet feedback states should guide without distracting from list and shopping flows."
          variant="muted"
          spacing="lg"
        >
          <Grid columns="three">
            {emptyStateVariants.map((variant) => (
              <EmptyState
                key={variant}
                icon={<Inbox className="size-5" />}
                title={`Empty ${variant}`}
                description="Use for empty lists, empty searches, or completed states."
                actionLabel={variant === 'plain' ? undefined : 'Add item'}
                variant={variant}
              />
            ))}
          </Grid>
          <Grid columns="three">
            {emptyStateSizes.map((size) => (
              <EmptyState
                key={size}
                icon={<Archive className="size-5" />}
                title={`Size ${size}`}
                description="Size preview."
                size={size}
                variant="default"
              />
            ))}
          </Grid>
          <Grid columns="three">
            <Alert>
              <AlertTitle>Ready to shop</AlertTitle>
              <AlertDescription>
                Base and ongoing items are combined.
              </AlertDescription>
            </Alert>
            <Alert variant="info">
              <AlertTitle>Shared session</AlertTitle>
              <AlertDescription>
                Progress updates for everyone.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Confirm finish</AlertTitle>
              <AlertDescription>
                Skipped non-base items carry over.
              </AlertDescription>
            </Alert>
          </Grid>
        </Section>

        <Section
          title="Variant coverage"
          description="Every prop value exposed by the local design-system primitives is represented here."
          variant="bordered"
          spacing="lg"
        >
          <Stack gap="lg">
            <Grid columns="four">
              {pageShellSizes.map((size) => (
                <PageShell
                  key={size}
                  size={size}
                  spacing="sm"
                  className="rounded-xl border bg-card"
                  title={`Page ${size}`}
                />
              ))}
            </Grid>
            <Grid columns="three">
              {pageShellSpacings.map((spacing) => (
                <PageShell
                  key={spacing}
                  size="full"
                  spacing={spacing}
                  className="rounded-xl border bg-card"
                  title={`Spacing ${spacing}`}
                />
              ))}
            </Grid>

            <Grid columns="three">
              {sectionVariants.map((variant) => (
                <Section
                  key={variant}
                  title={`Section ${variant}`}
                  variant={variant}
                  spacing="sm"
                >
                  <Text size="sm" tone="muted">
                    Variant preview.
                  </Text>
                </Section>
              ))}
            </Grid>
            <Grid columns="three">
              {sectionSpacings.map((spacing) => (
                <Section
                  key={spacing}
                  title={`Section spacing ${spacing}`}
                  variant="bordered"
                  spacing={spacing}
                >
                  <Text size="sm" tone="muted">
                    Spacing preview.
                  </Text>
                </Section>
              ))}
            </Grid>

            <Grid columns="auto">
              {surfaceVariants.map((variant) => (
                <Surface key={variant} variant={variant}>
                  <Text weight="medium">Surface {variant}</Text>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {surfacePaddings.map((padding) => (
                <Surface key={padding} padding={padding} variant="outline">
                  <Text size="sm">Padding {padding}</Text>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {surfaceRadii.map((radius) => (
                <Surface key={radius} radius={radius} variant="muted">
                  <Text size="sm">Radius {radius}</Text>
                </Surface>
              ))}
            </Grid>

            <Grid columns="three">
              {stackGaps.map((gap) => (
                <Surface key={gap} variant="outline" padding="sm">
                  <Stack gap={gap}>
                    <Badge variant="outline">Stack {gap}</Badge>
                    <Surface padding="sm">A</Surface>
                    <Surface padding="sm">B</Surface>
                  </Stack>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {alignVariants.map((align) => (
                <Surface key={align} variant="outline" padding="sm">
                  <Stack align={align} gap="xs">
                    <Badge>Stack align {align}</Badge>
                    <Button size="sm" variant="outline">
                      Item
                    </Button>
                  </Stack>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {justifyVariants.map((justify) => (
                <Surface
                  key={justify}
                  variant="outline"
                  padding="sm"
                  className="h-28"
                >
                  <Stack justify={justify} gap="xs" className="h-full">
                    <Badge>Stack justify {justify}</Badge>
                    <Button size="sm" variant="outline">
                      Item
                    </Button>
                  </Stack>
                </Surface>
              ))}
            </Grid>

            <Grid columns="auto">
              {inlineGaps.map((gap) => (
                <Surface key={gap} variant="outline" padding="sm">
                  <Inline gap={gap}>
                    <Badge variant="outline">Inline {gap}</Badge>
                    <Badge>A</Badge>
                    <Badge>B</Badge>
                  </Inline>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {alignVariants.map((align) => (
                <Surface key={align} variant="outline" padding="sm">
                  <Inline align={align} className="h-14">
                    <Badge>Inline align {align}</Badge>
                    <Button size="sm" variant="outline">
                      Item
                    </Button>
                  </Inline>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {justifyVariants.map((justify) => (
                <Surface key={justify} variant="outline" padding="sm">
                  <Inline justify={justify}>
                    <Badge>Inline justify {justify}</Badge>
                    <Button size="sm" variant="outline">
                      Item
                    </Button>
                  </Inline>
                </Surface>
              ))}
            </Grid>
            <Grid columns="two">
              <Surface variant="outline">
                <Inline wrap>
                  <Badge>wrap true</Badge>
                  <Badge>one</Badge>
                  <Badge>two</Badge>
                  <Badge>three</Badge>
                </Inline>
              </Surface>
              <Surface variant="outline" className="overflow-hidden">
                <Inline wrap={false}>
                  <Badge>wrap false</Badge>
                  <Badge>one</Badge>
                  <Badge>two</Badge>
                  <Badge>three</Badge>
                </Inline>
              </Surface>
            </Grid>

            <Stack gap="sm">
              {gridColumns.map((columns) => (
                <Surface key={columns} variant="outline">
                  <Stack gap="sm">
                    <Badge variant="outline">Grid {columns}</Badge>
                    <Grid columns={columns} gap="sm">
                      <Surface padding="sm">A</Surface>
                      <Surface padding="sm">B</Surface>
                      <Surface padding="sm">C</Surface>
                      <Surface padding="sm">D</Surface>
                    </Grid>
                  </Stack>
                </Surface>
              ))}
            </Stack>
            <Grid columns="three">
              {gridGaps.map((gap) => (
                <Surface key={gap} variant="outline">
                  <Grid columns="two" gap={gap}>
                    <Surface padding="sm">{gap}</Surface>
                    <Surface padding="sm">gap</Surface>
                  </Grid>
                </Surface>
              ))}
            </Grid>

            <Stack gap="sm">
              {headingSizes.map((size, index) => (
                <Heading
                  key={size}
                  level={Math.min(index + 1, 4) as 1 | 2 | 3 | 4}
                  size={size}
                >
                  Heading {size}
                </Heading>
              ))}
              {headingTones.map((tone) => (
                <Heading key={tone} tone={tone} size="h4">
                  Heading tone {tone}
                </Heading>
              ))}
            </Stack>
            <Grid columns="four">
              {textSizes.map((size) => (
                <Text key={size} size={size}>
                  Text {size}
                </Text>
              ))}
              {textTones.map((tone) => (
                <Text key={tone} tone={tone}>
                  Text {tone}
                </Text>
              ))}
              {textWeights.map((weight) => (
                <Text key={weight} weight={weight}>
                  Text {weight}
                </Text>
              ))}
              <Text as="span">Text as span</Text>
              <Text as="div">Text as div</Text>
            </Grid>

            <Inline gap="sm">
              {statusTones.map((tone) => (
                <StatusChip key={tone} tone={tone}>
                  {tone}
                </StatusChip>
              ))}
            </Inline>
            <Inline gap="sm">
              {statusSizes.map((size) => (
                <StatusChip key={size} size={size}>
                  status {size}
                </StatusChip>
              ))}
            </Inline>

            <Grid columns="four">
              {progressTones.map((tone) => (
                <ProgressSummary
                  key={tone}
                  tone={tone}
                  progress={62}
                  label={tone}
                  value="62%"
                />
              ))}
            </Grid>
            <Grid columns="three">
              {progressSizes.map((size) => (
                <ProgressSummary
                  key={size}
                  size={size}
                  progress={44}
                  label={size}
                  value="44%"
                />
              ))}
            </Grid>

            <Grid columns="three">
              {bottomLayouts.map((layout) => (
                <BottomActionBar key={layout} position="static" layout={layout}>
                  <Button variant="outline">Skip</Button>
                  <Button>Done</Button>
                </BottomActionBar>
              ))}
            </Grid>
            <Grid columns="three">
              {bottomPositions.map((position) => (
                <Surface key={position} variant="outline">
                  <Text size="sm" weight="semibold">
                    Bottom bar {position}
                  </Text>
                  {position !== 'fixed' && (
                    <BottomActionBar
                      position={position}
                      layout="single"
                      className="mt-3 rounded-xl"
                    >
                      <Button>Preview</Button>
                    </BottomActionBar>
                  )}
                  {position === 'fixed' && (
                    <StatusChip tone="info">
                      Fixed preview is active at screen bottom
                    </StatusChip>
                  )}
                </Surface>
              ))}
            </Grid>

            <Grid columns="four">
              {actionTileVariants.map((variant) => (
                <ActionTile
                  key={variant}
                  title={`Tile ${variant}`}
                  description="Variant preview"
                  variant={variant}
                />
              ))}
            </Grid>
            <Grid columns="three">
              {actionTileSizes.map((size) => (
                <ActionTile
                  key={size}
                  title={`Tile ${size}`}
                  description="Size preview"
                  size={size}
                />
              ))}
            </Grid>

            <Grid columns="three">
              {toolbarVariants.map((variant) => (
                <Toolbar
                  key={variant}
                  variant={variant}
                  search={<Input placeholder={`Toolbar ${variant}`} />}
                />
              ))}
            </Grid>
            <Grid columns="three">
              {toolbarAligns.map((align) => (
                <Toolbar
                  key={align}
                  align={align}
                  actions={<Button size="sm">{align}</Button>}
                />
              ))}
            </Grid>

            <Grid columns="auto">
              {statTones.map((tone) => (
                <Stat
                  key={tone}
                  label={tone}
                  value="12"
                  description="Tone preview"
                  tone={tone}
                />
              ))}
            </Grid>
            <Inline gap="sm">
              {kbdSizes.map((size) => (
                <Kbd key={size} size={size}>
                  {size}
                </Kbd>
              ))}
            </Inline>
          </Stack>
        </Section>

        <BottomActionBar
          position="fixed"
          layout="split"
          className="pointer-events-none opacity-95 sm:hidden"
        >
          <Button size="lg" variant="outline">
            <Home />
            Lists
          </Button>
          <Button size="lg">
            <ListChecks />
            Shop
          </Button>
        </BottomActionBar>
      </PageShell>
    </Layout>
  );
});

export { Ds };
