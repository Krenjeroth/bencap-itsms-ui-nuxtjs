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
  enableTab: {
    type: Boolean,
    default: false,
  },
  tabItems: {
    type: Array as PropType<ITableTabItem[]>,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:page",
  "update:pageCount",
  "update:sort",
  "update:search",
  "update:selected-dropdown-filter",
  "update:active-tab",
]);

const { getStatusColor } = useColorHandler();
const { capitalizeWord } = useStringHandler();
const searchQuery = ref(props.search);
const dropdownFilter = ref(props.selectedDropdownFilter);

const localPage = ref(props.pagination.page);
const localPageCount = ref(Number(props.pagination.pageCount));

// Start Tab Items

const filteredTableData = computed(() => {
  switch (currentTab.value) {
    case "open":
      return props.tableData.filter((row) => row.request_status === "open");
    case "closed":
      return props.tableData.filter((row) => row.request_status === "closed");
    case "accepted_by_others":
      return props.tableData.filter((row) => row.is_accepted_by_others);
    case "accepted_by_me":
      return props.tableData.filter((row) => row.is_accepted_by_me);
    case "other_agency":
      return props.tableData.filter((row) => row.is_other_agency);
    // case "unaccepted":
    //   return props.tableData.filter((row) => !row.is_accepted_by_me);
    default:
      return props.tableData;
  }
});

const localSort = ref(props.sorting);

const sortedTableData = computed(() => {
  const data = [...filteredTableData.value];

  if (!localSort.value?.column) {
    return data.sort((a, b) => {
      const acceptedA = Number(!!a.is_accepted_by_me);
      const acceptedB = Number(!!b.is_accepted_by_me);
      if (acceptedA !== acceptedB) return acceptedB - acceptedA;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }

  const { column, direction } = localSort.value;
  return data.sort((a, b) => {
    const valA = a[column];
    const valB = b[column];
    if (valA == null) return 1;
    if (valB == null) return -1;
    const cmp = valA > valB ? 1 : valA < valB ? -1 : 0;
    return direction === "asc" ? cmp : -cmp;
  });
});

// const activeTab = ref(["all"]);
const activeTab = ref(0);

const currentTab = computed(() =>
  props.enableTab ? props.tabItems[activeTab.value].value : "all"
);
// const currentTab = computed(() => activeTab.value[0]);

// End Tab Items

// Columns
const selectedColumns = ref(props.columns);
const columnsTable = computed(() =>
  props.columns
    .filter((column) => selectedColumns.value.includes(column))
    .map((column) => ({
      ...column,
      responsiveClass: column.responsiveClass || "",
    }))
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
const pageFrom = computed(() =>
  paginationTotal.value === 0
    ? 0
    : (props.pagination.page - 1) * props.pagination.pageCount + 1
);

const pageTo = computed(() =>
  Math.min(
    props.pagination.page * props.pagination.pageCount,
    paginationTotal.value
  )
);

const paginationTotal = computed(() => {
  // If not on the 'all' tab, or if search or dropdown filter is active, use filtered data length
  if (currentTab.value !== "all" || searchQuery.value || dropdownFilter.value) {
    return sortedTableData.value.length;
  }
  return props.pagination.total;
});

const resetFilters = () => {
  searchQuery.value = "";
  dropdownFilter.value = "";
};

// const localSort = ref(props.sorting);

watch([currentTab, localPageCount], () => {
  localPage.value = 1;
});

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

watch(activeTab, (e) => {
  emit("update:active-tab", e);
});

watch(localPageCount, (newCount) => {
  localPage.value = 1;
  emit("update:pageCount", Number(newCount));
});

watch(localPage, (newPage) => {
  emit("update:page", newPage);
});

watch([currentTab, dropdownFilter, searchQuery], () => {
  localPage.value = 1;
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

        <!-- <USelect
          v-model="props.pagination.pageCount"
          :options="[5, 10, 20, 50]"
          class="me-2 w-20"
          size="xs"
          @update:modelValue="
            emit('update:pageCount', props.pagination.pageCount)
          "
        /> -->
        <USelect
          v-model.number="localPageCount"
          :options="[5, 10, 20, 50]"
          class="me-2 w-20"
          size="xs"
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

    <div v-if="props.enableTab" class="flex w-full px-2 pt-2">
      <UTabs
        :items="props.tabItems"
        v-model="activeTab"
        :ui="{
          wrapper: 'justify-center w-full',
        }"
      >
        <template #icon="{ item, selected }">
          <UIcon
            :name="item.icon"
            class="w-5 h-5 flex-shrink-0 me-2"
            :class="[selected && 'text-primary-500 dark:text-primary-400']"
          />
        </template>
      </UTabs>
    </div>

    <!-- Table Expandable -->
    <UTable
      :key="props.isExpandable ? 'expand-enabled' : 'expand-disabled'"
      v-if="props.isExpandable"
      v-model:expand="expand"
      :rows="sortedTableData"
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
      <template #date_formatted-header="{ column }">
        <th :class="column.responsiveClass">{{ column.label }}</th>
      </template>

      <template #date_formatted-data="{ column, row }">
        <td :class="column.responsiveClass">{{ row.date_formatted }}</td>
      </template>

      <template #photo-data="{ row }">
        <UAvatar
          size="3xl"
          :src="row.profile?.img_path"
          :alt="`${capitalizeWord(
            row.profile.name.firstname.match(/^\S+/)?.[0]
          )} ${capitalizeWord(row.profile.name.lastname)}`"
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
        <UBadge variant="outline" :color="getStatusColor(row.query_status)">{{
          row.query_status_formatted
        }}</UBadge>
      </template>

      <template #request_status_formatted-data="{ row }">
        <UBadge :color="getStatusColor(row.request_status)" variant="outline">{{
          row.request_status_formatted
        }}</UBadge>
      </template>

      <template #priority_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.priority)"
          variant="outline"
          class="mr-2"
          >{{ row.priority_formatted }}</UBadge
        >
      </template>

      <template #service_method_formatted-data="{ row }">
        <UBadge :color="getStatusColor(row.service_method)" variant="outline">{{
          row.service_method_formatted
        }}</UBadge>

        <div
          class="mt-2"
          v-if="row.service_method === 'pulled_out' && row.released_at !== null"
        >
          <UBadge :color="getStatusColor(row.service_method)" variant="outline">
            Released: {{ row.released_at_formatted }}
          </UBadge>
        </div>
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

      <template #property_number-data="{ row }">
        <div class="grid grid-cols-1">
          <span>
            <UBadge color="gray" variant="subtle" class="m-0.5">{{
              row.property_number
            }}</UBadge>
          </span>

          <span>
            <UBadge
              v-if="row.inventory"
              color="blue"
              variant="subtle"
              class="m-0.5"
              >Parent: {{ row.inventory.property_number }}</UBadge
            >
          </span>
        </div>
      </template>

      <template #component_classification-data="{ row }">
        <UBadge
          :color="getStatusColor(row.component_classification)"
          variant="solid"
          class="m-0.5"
          >{{ row.component_classification }}</UBadge
        >
      </template>

      <template #personnel-data="{ row }">
        <div v-if="Array.isArray(row.personnel) && row.personnel.length > 0">
          <UAvatarGroup
            size="2xl"
            :max="3"
            :key="row.personnel && row.personnel.length ? row.personnel.map((p:any) => p.id).join('-') : 'none'"
          >
            <UAvatar
              v-for="personnel in row.personnel"
              :src="personnel.img_path"
              :alt="personnel.display_name.toLowerCase()"
            />
          </UAvatarGroup>
        </div>
        <div v-else class="italic">None</div>
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
        <div
          class="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm grid grid-cols-2 gap-2"
        >
          <div
            v-for="detail in expandableDetails(row)"
            :key="detail.key"
            v-show="detail.show"
            class="font-mono"
          >
            <strong>{{ detail.label }}</strong
            >:
            <span class="italic whitespace-pre-line">{{ detail.value }}</span>
          </div>
          <!-- <p v-for="detail in expandableDetails(row)" :key="detail.key">
            <strong>{{ detail.label }}</strong
            >:
            <span class="italic whitespace-pre-line">{{ detail.value }}</span>
          </p> -->
          <!-- <UTable :rows="expandableDetails(row)" :columns="columnsTable" /> -->
        </div>
      </template>
    </UTable>

    <!-- Table Non-Expandable -->
    <UTable
      v-else
      :rows="sortedTableData"
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
      <template #date_formatted-header="{ column }">
        <th :class="column.responsiveClass">{{ column.label }}</th>
      </template>

      <template #date_formatted-data="{ column, row }">
        <td :class="column.responsiveClass">{{ row.date_formatted }}</td>
      </template>

      <template #photo-data="{ row }">
        <UAvatar
          size="3xl"
          :src="row.profile?.img_path"
          :alt="`${capitalizeWord(
            row.profile.name.firstname.match(/^\S+/)?.[0]
          )} ${capitalizeWord(row.profile.name.lastname)}`"
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
        <UBadge variant="outline" :color="getStatusColor(row.query_status)">{{
          row.query_status_formatted
        }}</UBadge>
      </template>

      <template #request_status_formatted-data="{ row }">
        <UBadge :color="getStatusColor(row.request_status)" variant="outline">{{
          row.request_status_formatted
        }}</UBadge>
      </template>

      <template #priority_formatted-data="{ row }">
        <UBadge
          :color="getStatusColor(row.priority)"
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

      <template #personnel-data="{ row }">
        <div v-if="Array.isArray(row.personnel) && row.personnel.length > 0">
          <UAvatarGroup
            size="2xl"
            :max="3"
            :key="row.personnel && row.personnel.length ? row.personnel.map((p:any) => p.id).join('-') : 'none'"
          >
            <UAvatar
              v-for="personnel in row.personnel"
              :src="personnel.img_path"
              :alt="personnel.display_name.toLowerCase()"
            />
          </UAvatarGroup>
        </div>
        <div v-else class="italic">None</div>
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
        <span class="font-medium">{{ paginationTotal }}</span>
        results
      </p>
      <!-- <UPagination
        v-model="localPage"
        :total="paginationTotal"
        :page-count="localPageCount"
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
      /> -->
      <UPagination
        v-model="localPage"
        :total="paginationTotal"
        :page-count="localPageCount"
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
