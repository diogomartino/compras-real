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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Layout className="p-0">
      <PageShell
        eyebrow={t('ds.eyebrow')}
        title={t('ds.title')}
        description={t('ds.description')}
        actions={
          <Button size="sm">
            <Plus />
            {t('ds.addItem')}
          </Button>
        }
        size="lg"
        spacing="lg"
      >
        <Section
          title={t('ds.appFoundations')}
          description={t('ds.appFoundationsDescription')}
          variant="bordered"
          spacing="lg"
        >
          <Grid columns="three" gap="lg">
            <Stat
              label={t('ds.baseList')}
              value="18"
              description={t('ds.alwaysIncluded')}
              tone="default"
            />
            <Stat
              label={t('ds.currentList')}
              value="5"
              description={t('ds.addedThisWeek')}
              tone="success"
              trend={
                <span className="text-green-700 dark:text-green-300">
                  {t('ds.ready')}
                </span>
              }
            />
            <Stat
              label={t('ds.shopping')}
              value="8 / 23"
              description={t('ds.currentProgress')}
              tone="warn"
            />
          </Grid>

          <Grid columns="three" gap="lg">
            <ActionTile
              icon={<ShoppingBasket className="size-5" />}
              title={t('ds.startShopping')}
              description={t('ds.startShoppingDescription')}
              variant="primary"
              meta={<StatusChip tone="pending">{t('ds.itemsCount', { count: 23 })}</StatusChip>}
            />
            <ActionTile
              icon={<PackagePlus className="size-5" />}
              title={t('ds.productCatalog')}
              description={t('ds.productCatalogDescription')}
              variant="default"
            />
            <ActionTile
              icon={<History className="size-5" />}
              title={t('ds.history')}
              description={t('ds.historyDescription')}
              variant="muted"
            />
          </Grid>
        </Section>

        <Section
          title={t('ds.managementToolbar')}
          description={t('ds.managementToolbarDescription')}
          variant="default"
          spacing="lg"
        >
          <Toolbar
            search={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder={t('ds.searchProducts')} />
              </div>
            }
            filters={
              <>
                <Button variant="outline" size="sm">
                  <Filter />
                  {t('ds.dairy')}
                </Button>
                <Button variant="outline" size="sm">
                  <Tags />
                  {t('common.uncategorized')}
                </Button>
              </>
            }
            actions={
              <Button size="sm">
                <Plus />
                {t('ds.addProduct')}
              </Button>
            }
          />
        </Section>

        <Section
          title={t('ds.mediaRows')}
          description={t('ds.mediaRowsDescription')}
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
                  title={t('ds.milk')}
                  description={t('ds.milkDescription')}
                  meta={<StatusChip tone="info">{t('ds.base')}</StatusChip>}
                  trailing={<Text weight="semibold">{t('ds.twoUnits')}</Text>}
                />
                <ListRow
                  leading={<Media fallback="C" />}
                  title={t('ds.coke')}
                  description={t('ds.cokeDescription')}
                  meta={<StatusChip tone="pending">{t('ds.pending')}</StatusChip>}
                  trailing={<Text weight="semibold">{t('ds.sixBottles')}</Text>}
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
                title={t('ds.rowVariant', { variant })}
                description={t('ds.variantPreview')}
                trailing={<StatusChip tone="muted">{t('ds.twoKg')}</StatusChip>}
                variant={variant}
              />
            ))}
          </Grid>

          <Grid columns="three">
            {listRowSizes.map((size) => (
              <ListRow
                key={size}
                leading={<Media size="sm" fallback={size.toUpperCase()} />}
                title={t('ds.rowSize', { size })}
                description={t('ds.sizePreview')}
                trailing={<StatusChip tone="neutral">{t('ds.oneBox')}</StatusChip>}
                size={size}
              />
            ))}
          </Grid>
        </Section>

        <Section
          title={t('ds.shoppingComposition')}
          description={t('ds.shoppingCompositionDescription')}
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
                  label={t('ds.shoppingProgress')}
                  value="8 / 23"
                  progress={35}
                  size="lg"
                />
                <Stack gap="sm">
                  <ListRow
                    leading={<Media size="lg" fallback="E" />}
                    title={t('ds.eggs')}
                    description={t('ds.eggsDescription')}
                    meta={
                      <StatusChip tone="pending" size="md">
                        {t('ds.pending')}
                      </StatusChip>
                    }
                    trailing={<Text weight="semibold">{t('ds.twoPacks')}</Text>}
                    actions={
                      <Inline gap="sm">
                        <Button size="sm">
                          <Check />
                          {t('ds.done')}
                        </Button>
                        <Button size="sm" variant="outline">
                          <SkipForward />
                          {t('ds.skip')}
                        </Button>
                      </Inline>
                    }
                    size="lg"
                  />
                  <ListRow
                    leading={<Media fallback="T" />}
                    title={t('ds.toiletPaper')}
                    description={t('ds.cleaning')}
                    meta={<StatusChip tone="success">{t('ds.done')}</StatusChip>}
                    trailing={
                      <Button size="sm" variant="ghost">
                        <Undo2 />
                        {t('ds.undo')}
                      </Button>
                    }
                    variant="muted"
                  />
                  <ListRow
                    leading={<Media fallback="B" />}
                    title={t('ds.chickenBreast')}
                    description={t('ds.meat')}
                    meta={<StatusChip tone="skipped">{t('ds.skipped')}</StatusChip>}
                    trailing={
                      <Button size="sm" variant="ghost">
                        <Undo2 />
                        {t('ds.undo')}
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
                    {t('ds.swipeView')}
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
                    {t('ds.dishwasherTablets')}
                  </Heading>
                  <Inline gap="sm" justify="center">
                    <StatusChip tone="muted">{t('ds.cleaning')}</StatusChip>
                    <StatusChip tone="neutral">{t('ds.oneBox')}</StatusChip>
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
                    {t('ds.skip')}
                  </Button>
                  <Button size="lg">
                    <Check />
                    {t('ds.done')}
                  </Button>
                </BottomActionBar>
              </Stack>
            </Surface>
          </Grid>
        </Section>

        <Section
          title={t('ds.forms')}
          description={t('ds.formsDescription')}
          variant="default"
          spacing="lg"
        >
          <Grid columns="two" gap="lg">
            <Stack gap="md">
              <Field
                label={t('ds.name')}
                description={t('ds.nameDescription')}
                required
              >
                <Input placeholder={t('ds.coke')} />
              </Field>
              <Field label={t('ds.category')}>
                <Select defaultValue="drinks">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('ds.chooseCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">{t('ds.dairy')}</SelectItem>
                    <SelectItem value="drinks">{t('ds.drinks')}</SelectItem>
                    <SelectItem value="cleaning">{t('ds.cleaning')}</SelectItem>
                    <SelectItem value="uncategorized">
                      {t('common.uncategorized')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label={t('ds.defaultQuantity')}
                description={t('ds.defaultQuantityDescription')}
              >
                <Inline gap="sm" wrap={false}>
                  <Input defaultValue="6" type="number" />
                  <Select defaultValue="bottles">
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">{t('ds.units')}</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="packs">{t('ds.packs')}</SelectItem>
                      <SelectItem value="bottles">{t('ds.bottles')}</SelectItem>
                    </SelectContent>
                  </Select>
                </Inline>
              </Field>
            </Stack>

            <Stack gap="md">
              {fieldLayouts.map((layout) => (
                <Field
                  key={layout}
                  label={t('ds.fieldLayout', { layout })}
                  description={t('ds.layoutPreview')}
                  layout={layout}
                >
                  <Input placeholder={t('ds.preview')} />
                </Field>
              ))}
              <Field
                label={t('ds.productUrl')}
                description={t('ds.productUrlDescription')}
                error={t('ds.importNotImplemented')}
              >
                <Inline gap="sm" wrap={false}>
                  <Input placeholder="https://example.com/product" />
                  <Button variant="outline" disabled>
                    <Sparkles />
                    {t('ds.later')}
                  </Button>
                </Inline>
              </Field>
              <Surface variant="outline">
                <Stack gap="sm">
                  <Inline justify="between" wrap={false}>
                    <Text weight="medium">{t('ds.trackProduct')}</Text>
                    <Switch />
                  </Inline>
                  <Inline gap="sm">
                    <Checkbox defaultChecked />
                    <Text size="sm" tone="muted">
                      {t('ds.keepHistoryVisible')}
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
          title={t('ds.feedback')}
          description={t('ds.feedbackDescription')}
          variant="muted"
          spacing="lg"
        >
          <Grid columns="three">
            {emptyStateVariants.map((variant) => (
              <EmptyState
                key={variant}
                icon={<Inbox className="size-5" />}
                title={t('ds.emptyVariant', { variant })}
                description={t('ds.emptyDescription')}
                actionLabel={variant === 'plain' ? undefined : t('ds.addItem')}
                variant={variant}
              />
            ))}
          </Grid>
          <Grid columns="three">
            {emptyStateSizes.map((size) => (
              <EmptyState
                key={size}
                icon={<PackagePlus className="size-5" />}
                title={t('ds.sizeTitle', { size })}
                description={t('ds.sizePreview')}
                size={size}
                variant="default"
              />
            ))}
          </Grid>
          <Grid columns="three">
            <Alert>
              <AlertTitle>{t('ds.readyToShop')}</AlertTitle>
              <AlertDescription>
                {t('ds.readyToShopDescription')}
              </AlertDescription>
            </Alert>
            <Alert variant="info">
              <AlertTitle>{t('ds.sharedSession')}</AlertTitle>
              <AlertDescription>
                {t('ds.sharedSessionDescription')}
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>{t('ds.confirmFinish')}</AlertTitle>
              <AlertDescription>
                {t('ds.confirmFinishDescription')}
              </AlertDescription>
            </Alert>
          </Grid>
        </Section>

        <Section
          title={t('ds.variantCoverage')}
          description={t('ds.variantCoverageDescription')}
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
                  title={t('ds.pageSize', { size })}
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
                  title={t('ds.spacing', { spacing })}
                />
              ))}
            </Grid>

            <Grid columns="three">
              {sectionVariants.map((variant) => (
                <Section
                  key={variant}
                  title={t('ds.sectionVariant', { variant })}
                  variant={variant}
                  spacing="sm"
                >
                  <Text size="sm" tone="muted">
                    {t('ds.variantPreview')}
                  </Text>
                </Section>
              ))}
            </Grid>
            <Grid columns="three">
              {sectionSpacings.map((spacing) => (
                <Section
                  key={spacing}
                  title={t('ds.sectionSpacing', { spacing })}
                  variant="bordered"
                  spacing={spacing}
                >
                  <Text size="sm" tone="muted">
                    {t('ds.spacingPreview')}
                  </Text>
                </Section>
              ))}
            </Grid>

            <Grid columns="auto">
              {surfaceVariants.map((variant) => (
                <Surface key={variant} variant={variant}>
                  <Text weight="medium">
                    {t('ds.surfaceVariant', { variant })}
                  </Text>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {surfacePaddings.map((padding) => (
                <Surface key={padding} padding={padding} variant="outline">
                  <Text size="sm">{t('ds.padding', { padding })}</Text>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {surfaceRadii.map((radius) => (
                <Surface key={radius} radius={radius} variant="muted">
                  <Text size="sm">{t('ds.radius', { radius })}</Text>
                </Surface>
              ))}
            </Grid>

            <Grid columns="three">
              {stackGaps.map((gap) => (
                <Surface key={gap} variant="outline" padding="sm">
                  <Stack gap={gap}>
                    <Badge variant="outline">{t('ds.stackGap', { gap })}</Badge>
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
                    <Badge>{t('ds.stackAlign', { align })}</Badge>
                    <Button size="sm" variant="outline">
                      {t('ds.item')}
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
                    <Badge>{t('ds.stackJustify', { justify })}</Badge>
                    <Button size="sm" variant="outline">
                      {t('ds.item')}
                    </Button>
                  </Stack>
                </Surface>
              ))}
            </Grid>

            <Grid columns="auto">
              {inlineGaps.map((gap) => (
                <Surface key={gap} variant="outline" padding="sm">
                  <Inline gap={gap}>
                    <Badge variant="outline">{t('ds.inlineGap', { gap })}</Badge>
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
                    <Badge>{t('ds.inlineAlign', { align })}</Badge>
                    <Button size="sm" variant="outline">
                      {t('ds.item')}
                    </Button>
                  </Inline>
                </Surface>
              ))}
            </Grid>
            <Grid columns="four">
              {justifyVariants.map((justify) => (
                <Surface key={justify} variant="outline" padding="sm">
                  <Inline justify={justify}>
                    <Badge>{t('ds.inlineJustify', { justify })}</Badge>
                    <Button size="sm" variant="outline">
                      {t('ds.item')}
                    </Button>
                  </Inline>
                </Surface>
              ))}
            </Grid>
            <Grid columns="two">
              <Surface variant="outline">
                <Inline wrap>
                  <Badge>{t('ds.wrapTrue')}</Badge>
                  <Badge>{t('ds.one')}</Badge>
                  <Badge>{t('ds.two')}</Badge>
                  <Badge>{t('ds.three')}</Badge>
                </Inline>
              </Surface>
              <Surface variant="outline" className="overflow-hidden">
                <Inline wrap={false}>
                  <Badge>{t('ds.wrapFalse')}</Badge>
                  <Badge>{t('ds.one')}</Badge>
                  <Badge>{t('ds.two')}</Badge>
                  <Badge>{t('ds.three')}</Badge>
                </Inline>
              </Surface>
            </Grid>

            <Stack gap="sm">
              {gridColumns.map((columns) => (
                <Surface key={columns} variant="outline">
                  <Stack gap="sm">
                    <Badge variant="outline">
                      {t('ds.gridColumns', { columns })}
                    </Badge>
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
                    <Surface padding="sm">{t('ds.gap')}</Surface>
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
                  {t('ds.headingSize', { size })}
                </Heading>
              ))}
              {headingTones.map((tone) => (
                <Heading key={tone} tone={tone} size="h4">
                  {t('ds.headingTone', { tone })}
                </Heading>
              ))}
            </Stack>
            <Grid columns="four">
              {textSizes.map((size) => (
                <Text key={size} size={size}>
                  {t('ds.textSize', { size })}
                </Text>
              ))}
              {textTones.map((tone) => (
                <Text key={tone} tone={tone}>
                  {t('ds.textTone', { tone })}
                </Text>
              ))}
              {textWeights.map((weight) => (
                <Text key={weight} weight={weight}>
                  {t('ds.textWeight', { weight })}
                </Text>
              ))}
              <Text as="span">{t('ds.textAsSpan')}</Text>
              <Text as="div">{t('ds.textAsDiv')}</Text>
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
                  {t('ds.statusSize', { size })}
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
                  <Button variant="outline">{t('ds.skip')}</Button>
                  <Button>{t('ds.done')}</Button>
                </BottomActionBar>
              ))}
            </Grid>
            <Grid columns="three">
              {bottomPositions.map((position) => (
                <Surface key={position} variant="outline">
                  <Text size="sm" weight="semibold">
                    {t('ds.bottomBar', { position })}
                  </Text>
                  {position !== 'fixed' && (
                    <BottomActionBar
                      position={position}
                      layout="single"
                      className="mt-3 rounded-xl"
                    >
                      <Button>{t('ds.preview')}</Button>
                    </BottomActionBar>
                  )}
                  {position === 'fixed' && (
                    <StatusChip tone="info">
                      {t('ds.fixedPreview')}
                    </StatusChip>
                  )}
                </Surface>
              ))}
            </Grid>

            <Grid columns="four">
              {actionTileVariants.map((variant) => (
                <ActionTile
                  key={variant}
                  title={t('ds.tileVariant', { variant })}
                  description={t('ds.variantPreview')}
                  variant={variant}
                />
              ))}
            </Grid>
            <Grid columns="three">
              {actionTileSizes.map((size) => (
                <ActionTile
                  key={size}
                  title={t('ds.tileSize', { size })}
                  description={t('ds.sizePreview')}
                  size={size}
                />
              ))}
            </Grid>

            <Grid columns="three">
              {toolbarVariants.map((variant) => (
                <Toolbar
                  key={variant}
                  variant={variant}
                  search={<Input placeholder={t('ds.toolbar', { variant })} />}
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
                  description={t('ds.tonePreview')}
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
            {t('ds.lists')}
          </Button>
          <Button size="lg">
            <ListChecks />
            {t('ds.shop')}
          </Button>
        </BottomActionBar>
      </PageShell>
    </Layout>
  );
});

export { Ds };
