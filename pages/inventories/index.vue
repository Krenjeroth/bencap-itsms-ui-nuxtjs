<script setup lang="ts">
import { debounce } from "lodash";

const route = useRoute();
const { can } = useCan();

definePageMeta({
  middleware: ["sanctum:auth", "permission"],
  title: "Inventories",
  permission: "inventories.view",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  InventoriesCreateModal,
  InventoriesUpdateModal,
  InventoriesDeleteModal,
  InventoriesAddComponentModal,
  InventoriesGenerateReportModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const inventoryStore = useInventoryStore();
const {
  inventories: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalInventories,
  selectedStatus,
  selectedOfficeId,
  selectedItemTypeId,
  activeTab,
} = storeToRefs(inventoryStore);
const { columns, items, expandableDetails, tabItems } = model;

const officeStore = useOfficeStore();
const { officeSelect, loadingOfficeSelect } = storeToRefs(officeStore);
officeStore.fetchOfficeSelect();

const itemTypeStore = useItemTypeStore();
const { itemTypeSelect, loading: loadingItemTypes } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

inventoryStore.fetchInventories();

const addInventoryModal = () => {
  modal.open(InventoriesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} created.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const editInventoryModal = (inventoryItem: any) => {
  modal.open(InventoriesUpdateModal, {
    inventoryItem,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} updated.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onNoDataChange() {
      actionToastResult({
        icon: "i-heroicons-exclamation-circle",
        // title: "Error !",
        description: "No data changes detected.",
        id: "modal-warning",
        color: "yellow",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const addComponentModal = (inventoryItem: any) => {
  modal.open(InventoriesAddComponentModal, {
    inventoryItem,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} component added.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onNoDataChange() {
      actionToastResult({
        icon: "i-heroicons-exclamation-circle",
        // title: "Error !",
        description: "No data changes detected.",
        id: "modal-warning",
        color: "yellow",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const deleteInventoryModal = (inventoryItem: any) => {
  modal.open(InventoriesDeleteModal, {
    inventoryItem,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} deleted.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const generateReportModal = () => {
  modal.open(InventoriesGenerateReportModal, {
    pageTitle: route.meta.title as string,
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        description: "Inventory report download started.",
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onClose() {
      modal.close();
    },
  } as any);
};

const selectedOfficeOption = computed({
  get: () =>
    officeSelect.value.find(
      (o: any) => String(o.id) === String(selectedOfficeId.value),
    ) ?? null,
  set: (option: any) => {
    selectedOfficeId.value = option?.id ?? "";
  },
});

const clearOfficeFilter = () => {
  selectedOfficeId.value = "";
};

const debouncedFetch = debounce(() => {
  page.value = 1;
  inventoryStore.fetchInventories();
}, 400);

const selectedItemTypeOption = computed({
  get: () =>
    itemTypeSelect.value.find(
      (itemType: any) =>
        String(itemType.id) === String(selectedItemTypeId.value),
    ) ?? null,
  set: (option: any) => {
    selectedItemTypeId.value = option?.id ?? "";
  },
});

const clearItemTypeFilter = () => {
  selectedItemTypeId.value = "";
};

// Watch search changes and fetch when updated
watch(search, debouncedFetch);

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
// watch(pageCount, () => {
//   page.value = 1;
//   inventoryStore.fetchInventories();
// });

// ✅ Ensure pagination updates correctly
// watch([page, pageCount], () => {
//   inventoryStore.fetchInventories();
// });

watch(pageCount, () => {
  page.value = 1;
});

watch([page, pageCount], () => {
  inventoryStore.fetchInventories();
});

watch(selectedStatus, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
});

watch(activeTab, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
});

watch(selectedOfficeId, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
});

watch(selectedItemTypeId, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :is-expandable="true"
      :expandable-details="expandableDetails"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :enable-tab="true"
      :tab-items="tabItems"
      :add-data-modal="addInventoryModal"
      :enable-generate-report="true"
      :generate-report-modal="generateReportModal"
      :loading="loading"
      :action-handlers="{
        edit: editInventoryModal,
        delete: deleteInventoryModal,
        addComponent: addComponentModal,
      }"
      :enable-add-data="can('inventories.create')"
      :pagination="{ page, pageCount, total: totalInventories }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="inventoryStore.fetchInventories"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
      @update:active-tab="(value) => (activeTab = value)"
    >
      <template #filters>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2 min-w-[220px]">
            <USelectMenu
              v-model="selectedOfficeOption"
              :options="officeSelect"
              option-attribute="label"
              placeholder="Filter by Office..."
              :searchable="true"
              :loading="loadingOfficeSelect"
              class="w-full"
            >
              <template #option="{ option }">
                <span class="truncate">{{ option.label }}</span>
              </template>
            </USelectMenu>
            <UButton
              v-if="selectedOfficeId"
              icon="i-heroicons-x-mark-20-solid"
              color="gray"
              variant="ghost"
              size="xs"
              @click="clearOfficeFilter"
            />
          </div>

          <div class="flex items-center gap-2 min-w-[220px]">
            <USelectMenu
              v-model="selectedItemTypeOption"
              :options="itemTypeSelect"
              option-attribute="type"
              placeholder="Filter by Item Type..."
              :searchable="true"
              :loading="loadingItemTypes"
              class="w-full"
            >
              <template #option="{ option }">
                <span class="truncate">{{ option.type }}</span>
              </template>
            </USelectMenu>
            <UButton
              v-if="selectedItemTypeId"
              icon="i-heroicons-x-mark-20-solid"
              color="gray"
              variant="ghost"
              size="xs"
              @click="clearItemTypeFilter"
            />
          </div>
        </div>
      </template>
    </UiDatatable>
  </div>
</template>
