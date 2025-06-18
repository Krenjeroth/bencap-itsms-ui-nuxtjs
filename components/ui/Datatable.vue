<script setup lang="ts">
const props = defineProps({
  moduleTitle: {
    type: String,
    default: "",
  },
  columns: {
    type: Array as PropType<ITableColumns[]>,
    default: () => [],
  },
  tableData: {
    type: Array as PropType<ITableRow[]>,
    default: () => [],
  },
  actionItems: {
    type: Function as PropType<ITableActions>,
    default: () => [],
  },
  actionHandlers: {
    type: Object as PropType<{ [key: string]: (...args: any[]) => void }>,
    default: () => ({}),
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      total: 0,
      pageCount: 0,
    }),
  },
  sorting: {
    type: Object as PropType<{ column: string; direction: "asc" | "desc" }>,
  },
  search: String,
  loading: {
    type: Boolean,
    default: false,
  },
  addDataModal: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  dropdownFilterBy: {
    type: Array,
    default: () => [],
  },
  enableDropdownFilter: {
    type: Boolean,
    default: false,
  },
  selectedDropdownFilter: String,
  dropdownFilterOptions: Array,
  isExpandable: {
    type: Boolean,
    default: false,
  },
  expandableDetails: {
    type: Function as PropType<ITableExpandableDetails>,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:page",
  "update:pageCount",
  "update:sort",
  "update:search",
  "update:selected-dropdown-filter",
]);

const { getStatusColor } = useColorHandler();
const { capitalizeWord } = useStringHandler();
const searchQuery = ref(props.search);
const dropdownFilter = ref(props.selectedDropdownFilter);

// Columns
const selectedColumns = ref(props.columns);
const columnsTable = computed(() =>
  props.columns.filter((column) => selectedColumns.value.includes(column))
);
const excludeSelectColumn = computed(() =>
  props.columns.filter(
    (v) =>
      v.key !== "select" &&
      v.key !== "actions" &&
      v.key !== "name" &&
      v.key !== "full_name" &&
      v.key !== "photo" &&
      v.key !== "ticket_number" &&
      v.key !== "property_number" &&
      v.key !== "title" &&
      v.key !== "type" &&
      v.key !== "code"
  )
);

// Pagination info
const pageFrom = computed(
  () => (props.pagination.page - 1) * props.pagination.pageCount + 1
);
const pageTo = computed(() =>
  Math.min(
    props.pagination.page * props.pagination.pageCount,
    props.pagination.total
  )
);

const resetFilters = () => {
  searchQuery.value = "";
  dropdownFilter.value = "";
};

const localSort = ref(props.sorting);

watch([searchQuery], () => {
  props.pagination.page = 1;
});

watch(searchQuery, (q) => {
  emit("update:search", q);
});

watch(dropdownFilter, (e) => {
  emit("update:selected-dropdown-filter", e);
});

watch(localSort, (e) => {
  emit("update:sort", e);
});

const expand = ref({
  openedRows: [props.tableData[0]],
  row: {},
});
</script>

<template>
  <UCard
    class="w-full border border-gray-200 dark:border-gray-800"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-800',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h2
          class="font-semibold text-xl text-gray-800 dark:text-white leading-tight"
        >
          {{ moduleTitle }}
        </h2>
        <UButton
          :label="`Add ${moduleTitle}`"
          @click="addDataModal"
          color="primary"
          variant="solid"
        />
      </div>
    </template>
    <div
      class="flex gap-16 px-3 py-3.5 justify-between border-b border-gray-200 dark:border-gray-800"
    >
      <!-- Filters -->
      <div class="flex flex-1 items-center gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid"
          class="flex-1"
        />
        <USelect
          v-if="enableDropdownFilter"
          v-model="dropdownFilter"
          :options="props.dropdownFilterOptions"
          class="w-40"
        />
      </div>
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Rows per page:</span>

        <USelect
          v-model="props.pagination.pageCount"
          :options="[5, 10, 20, 50]"
          class="me-2 w-20"
          size="xs"
          @update:modelValue="
            emit('update:pageCount', props.pagination.pageCount)
          "
        />
      </div>

      <div class="flex gap-1.5 items-center">
        <USelectMenu
          v-model="selectedColumns"
          :options="excludeSelectColumn"
          multiple
        >
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
            Columns
          </UButton>
        </USelectMenu>

        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          size="xs"
          :disabled="
            enableDropdownFilter
              ? searchQuery === '' && dropdownFilter === ''
              : searchQuery === ''
          "
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
    </div>

    <!-- Table Expandable -->
    <UTable
      :key="props.isExpandable ? 'expand-enabled' : 'expand-disabled'"
      v-if="props.isExpandable"
      v-model:expand="expand"
      :rows="props.tableData"
      :columns="columnsTable"
      v-model:sort="localSort"
      :loading="props.loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      @update:sort="emit('update:sort', localSort)"
    >
      <template #photo-data="{ row }">
        <UAvatar
          size="3xl"
          :src="row.img_path"
          :alt="`${capitalizeWord(row.name.firstname)} ${capitalizeWord(
            row.name.lastname
          )}`"
        />
      </template>

      <template #roles-data="{ row }">
        <UBadge
          v-for="role in row.roles"
          :key="role.id"
          color="primary"
          variant="solid"
          class="mr-2"
          >{{ role.title }}</UBadge
        >
      </template>

      <template #query_status_formatted-data="{ row }">
        <UBadge
          variant="outline"
          :color="getStatusColor(row.query_status_formatted)"
          >{{ row.query_status_formatted }}</UBadge
        >
      </template>

      <template #request_status_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.request_status_formatted)"
          variant="outline"
          >{{ row.request_status_formatted }}</UBadge
        >
      </template>

      <template #priority_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.priority_formatted)"
          variant="outline"
          class="mr-2"
          >{{ row.priority_formatted }}</UBadge
        >
      </template>

      <template #permissions-data="{ row }">
        <UBadge
          v-for="permission in row.permissions"
          :key="permission.id"
          color="primary"
          variant="solid"
          class="m-0.5"
          >{{ permission.title }}</UBadge
        >
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row, props.actionHandlers)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>

      <template v-if="props.isExpandable" #expand="{ row }">
        <div class="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">
          <p v-for="detail in expandableDetails(row)" :key="detail.key">
            <strong>{{ detail.label }}</strong
            >: <span class="italic">{{ detail.value }}</span>
          </p>
        </div>
      </template>
    </UTable>

    <!-- Table Non-Expandable -->
    <UTable
      v-else
      :rows="props.tableData"
      :columns="columnsTable"
      v-model:sort="localSort"
      :loading="props.loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      @update:sort="emit('update:sort', localSort)"
    >
      <template #photo-data="{ row }">
        <UAvatar
          size="3xl"
          :src="row.img_path"
          :alt="`${capitalizeWord(row.name.firstname)} ${capitalizeWord(
            row.name.lastname
          )}`"
        />
      </template>

      <template #roles-data="{ row }">
        <UBadge
          v-for="role in row.roles"
          :key="role.id"
          color="primary"
          variant="solid"
          class="mr-2"
          >{{ role.title }}</UBadge
        >
      </template>

      <template #query_status_formatted-data="{ row }">
        <UBadge
          variant="outline"
          :color="getStatusColor(row.query_status_formatted)"
          >{{ row.query_status_formatted }}</UBadge
        >
      </template>

      <template #request_status_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.request_status_formatted)"
          variant="outline"
          >{{ row.request_status_formatted }}</UBadge
        >
      </template>

      <template #priority_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.priority_formatted)"
          variant="outline"
          class="mr-2"
          >{{ row.priority_formatted }}</UBadge
        >
      </template>

      <template #permissions-data="{ row }">
        <UBadge
          v-for="permission in row.permissions"
          :key="permission.id"
          color="primary"
          variant="solid"
          class="m-0.5"
          >{{ permission.title }}</UBadge
        >
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row, props.actionHandlers)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <div
      class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-800"
    >
      <p class="text-sm text-gray-500">
        Showing
        <span class="font-medium">{{ pageFrom }}</span>
        -
        <span class="font-medium">{{ pageTo }}</span>
        of
        <span class="font-medium">{{ props.pagination.total }}</span>
        results
      </p>
      <UPagination
        v-model="props.pagination.page"
        :total="Number(props.pagination.total) || 0"
        :page-count="Number(props.pagination.pageCount)"
        @update:modelValue="emit('update:page', $event)"
        :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: '!rounded-full min-w-[32px] justify-center',
          default: {
            activeButton: {
              variant: 'outline',
            },
          },
        }"
      />
    </div>
  </UCard>
</template>
