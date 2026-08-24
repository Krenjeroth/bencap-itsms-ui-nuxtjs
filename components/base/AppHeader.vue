<script setup lang="ts">
const { user, logout: logoutAction } = useSanctumAuth<IUser>();
const logout = async () => {
  await logoutAction();
};
const toast = useToast();
const stringHandler = useStringHandler();
const colorMode = useColorMode();
const colorModes = ["system", "light", "dark"];
const colorModeIcon = ref("mdi:sun-moon-stars");

const ticketStore = useTicketStore();

const notificationStore = useNotificationStore();
const { unreadCount, notifications } = storeToRefs(notificationStore);

const { fetchTicketApi } = useTicketApi();
const { actionToastResult } = useToastHandler();
const modal = useModal();

const pageTitleSingular = "Ticket";

import { TicketsAcceptModal } from "#components";

onMounted(() => {
  colorModeIcon.value = getColorModeIcon();
  notificationStore.startPolling();
});

onUnmounted(() => {
  notificationStore.stopPolling();
});

const acceptTicketModal = (ticket: any) => {
  modal.open(TicketsAcceptModal, {
    ticket,
    pageTitle: pageTitleSingular,

    onReloadTable() {
      notificationStore.fetchNotifications();
    },

    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        description: `${pageTitleSingular} accepted.`,
        id: "notification-modal-success",
        color: "green",
      });
    },

    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        description: "Something went wrong.",
        id: "notification-modal-error",
        color: "red",
      });
    },

    onClose() {
      modal.close();
    },
  });
};

const getColorModeIcon = () => {
  switch (colorMode.preference) {
    case "light":
      return "mdi:white-balance-sunny";
    case "dark":
      return "mdi:moon-and-stars";
    default:
      return "mdi:sun-moon-stars";
  }
};

const handleNotificationClick = async (notification: any) => {
  if (!notification.read_at) {
    await notificationStore.markNotificationAsRead(notification.id);
  }

  const ticketId = notification.data.ticket_id;

  if (notification.data.notification_type === "ticket_personnel_joined") {
    await navigateTo(`/tickets/${ticketId}`);
    return;
  }

  try {
    const ticket = await fetchTicketApi(ticketId);
    const formattedTicket = ticketStore.formatTicket(ticket);

    if (!ticket.can_accept) {
      // await navigateTo(`/tickets/${ticketId}`);
      console.log("To Implement this action.");
      return;
    }

    acceptTicketModal(formattedTicket);
  } catch (err) {
    console.error("Unable to load notification ticket:", err);

    actionToastResult({
      icon: "i-heroicons-x-circle",
      description: "Unable to load this ticket.",
      id: "notification-ticket-load-error",
      color: "red",
    });
  }
};

const toggleColorMode = () => {
  const currentIndex = colorModes.indexOf(colorMode.preference);
  const nextIndex = (currentIndex + 1) % colorModes.length;
  colorMode.preference = colorModes[nextIndex];
  colorModeIcon.value = getColorModeIcon();

  let toastSettings = {
    id: `color-mode-${colorMode.preference}`,
    title: `Color mode: ${stringHandler.capitalizeWord(colorMode.preference)}`,
    description: "",
    timeout: 2000,
  };

  if (colorMode.preference === "system") {
    toastSettings = {
      ...toastSettings,
      description: `${colorMode.value} mode detected`,
    };
  }

  toast.add(toastSettings);
};

const notificationItems = computed(() => {
  if (!notifications.value.length) {
    return [
      [{ label: "No notifications yet", disabled: true, isAction: true }],
    ];
  }

  const items = notifications.value.map((n: any) => ({
    isNotification: true,

    label:
      n.data.notification_type === "ticket_personnel_joined"
        ? `${n.data.joined_display_name} accepted ticket #${n.data.ticket_id}`
        : `New ticket #${n.data.ticket_id} — ${n.data.concern}`,

    icon:
      n.data.notification_type === "ticket_personnel_joined"
        ? "i-heroicons-user-plus"
        : "i-heroicons-ticket",

    iconColor: n.read_at ? "text-gray-400" : "text-primary-500",
    readAt: n.read_at,
    createdAt: n.created_at,

    click: () => handleNotificationClick(n),
  }));

  return [
    items,
    [
      {
        isAction: true,
        label: "Mark all as read",
        icon: "i-heroicons-check-circle",
        click: () => notificationStore.markAllNotificationsAsRead(),
      },
    ],
  ];
});

const userMenuItems = [
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: logout,
    },
  ],
];
</script>

<template>
  <header
    class="h-16 content-center bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <div
      class="px-4 sm:px-6 lg:px-8 max-w-full flex items-center justify-between gap-3 h-[--header-height]"
    >
      <!-- Left side -->
      <div class="lg:flex-1 flex items-center gap-1.5 min-w-0">
        <!-- Hamburger for mobile -->
        <UButton
          class="lg:hidden"
          icon="i-heroicons-bars-3"
          variant="ghost"
          @click="$emit('toggle-sidebar')"
          aria-label="Open sidebar"
        />
        <SvgsLogoWord />
      </div>

      <!-- Center -->
      <!-- <ul class="items-center gap-x-8 hidden lg:flex">
        <li class="relative">
          <ULink
            class="text-sm/6 font-semibold flex items-center gap-1"
            active-class="text-primary"
            inactive-class="hover:text-primary"
            :to="{
              name: 'index',
            }"
            >Dashboard</ULink
          >
        </li>
        <li class="relative">
          <ULink
            class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary"
            active-class="text-primary"
            inactive-class="hover:text-primary"
            to="https://ui2.nuxt.com/"
            >Settings</ULink
          >
        </li>
        <li class="relative">
          <ULink
            class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary"
            active-class="text-primary"
            inactive-class="hover:text-primary"
            to="https://nuxt.com/docs/guide"
            >Link</ULink
          >
        </li>
        <li class="relative">
          <ULink
            class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary"
            active-class="text-primary"
            inactive-class="hover:text-primary"
            to="https://nuxt.com/docs/guide"
            >Docs</ULink
          >
        </li>
      </ul> -->

      <!-- Right side -->
      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <!-- Search -->
        <!-- <UButton
          variant="ghost"
          icon="i-heroicons-magnifying-glass"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        /> -->

        <!-- Notifications -->
        <UDropdown
          :items="notificationItems"
          :popper="{ placement: 'bottom-end' }"
          :ui="{
            width: 'w-96',
            item: {
              base: 'text-left',
            },
          }"
        >
          <UChip
            :show="unreadCount > 0"
            :text="unreadCount > 9 ? '9+' : unreadCount"
            color="red"
            size="2xl"
          >
            <UButton
              variant="ghost"
              icon="i-heroicons-bell"
              class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            />
          </UChip>

          <template #item="{ item }">
            <div
              v-if="item.isNotification"
              class="flex w-full items-start gap-2 py-1 text-left"
              :class="{ 'font-semibold': !item.readAt }"
            >
              <UIcon
                :name="item.icon"
                class="mt-0.5 shrink-0"
                :class="item.iconColor"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm line-clamp-2">{{ item.label }}</p>
                <p class="text-xs text-gray-400">
                  {{ $dayjs(item.createdAt).fromNow() }}
                </p>
              </div>
              <span
                v-if="!item.readAt"
                class="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"
              />
            </div>

            <div v-else class="flex w-full items-center gap-2 py-1 text-left">
              <UIcon :name="item.icon" class="shrink-0" />
              <p class="text-sm">{{ item.label }}</p>
            </div>
          </template>
        </UDropdown>

        <!-- Theme Toggle -->
        <UButton
          variant="ghost"
          :icon="colorModeIcon"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="toggleColorMode"
        />

        <!-- User Menu -->
        <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <UButton
            variant="ghost"
            class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <UAvatar :src="user?.profile?.img_path" size="sm" />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{
              user?.profile?.display_name
            }}</span>
          </UButton>
        </UDropdown>
      </div>
    </div>
  </header>
</template>
