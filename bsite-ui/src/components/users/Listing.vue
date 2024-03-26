<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {usersAction} from "@/components/users/utils";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import { format } from "date-fns";
import {useSite} from "@/store/site";
import CreateMultipleUrlDialog from "@/components/urls/CreateMultipleUrlDialog.vue";
import {UserType} from "@/components/users/types";
import CreateEditUserDialog from "@/components/users/CreateEditUserDialog.vue";

// const prop = defineProps({
//   filters: {
//     type: Object,
//     default: () => {},
//   },
// });

const $toast = useToast({ position: 'top-right'});
const siteStore = useSite()

const siteId = computed(()=> siteStore.siteId)

const headers = ref([
  {
    title: 'Name',
    align: 'start',
    key: 'username',
  },
  { title: 'Email', key: 'email', align: 'start' },
  { title: 'Role', key: 'roles', align: 'start' },
  { title: 'Created at', key: 'createdAt', align: 'start' },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
])

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);

const confirmationDialog = ref(false);
const confirmationUser = ref<string>('');
const createEditDialog = ref(false);
const userDetail = ref<UserType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl(`/users`, options)
    const data = await httpService.get(url)
    serverItems.value = data.data
    totalItems.value = data.total
    loading.value = false
  } catch (e) {
    console.log(e)
  }
}
const onSelect = (option: string, data: any) => {
  if (option === "edit") {
    userDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationUser.value = data._id;
  }
}



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    userDetail.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationUser.value = '';
  }
});

const onUpdate = async (updatedVal: UserType) => {
  try {
    await httpService.patch(`/users/${updatedVal._id}`, updatedVal)
    $toast.success('User updated successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (newVal: UserType) => {
  try {
    await httpService.post(`/users`, newVal)
    $toast.success('User created successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onAddUrlClick = () => {
  userDetail.value = {
    username: "",
    email: "",
    roles: 'admin',
    id: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/users/${confirmationUser.value}`)
    $toast.success('Url deleted successfully!')
    confirmationDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};
</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        Users
        <v-badge :content="totalItems" inline color="light" rounded="sm" />
      </div>
        <v-btn
            color="primary"
            elevation="0"
            class="my-2"
            @click="onAddUrlClick"
        >
          <i class="ph-plus-circle mx-1" /> Add user
        </v-btn>
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table-server
          :header-props="{ class: 'font-weight-bold bg-light'}"
          class="table-component"
          v-model:items-per-page="itemsPerPage"
          :search="search.value"
          :headers="headers"
          :items-length="totalItems"
          :items="serverItems"
          :loading="loading"
          item-value="name"
          @update:options="loadItems"
      >
        <template v-slot:item.createdAt="{item}">
          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.email="{item}">
          <span class="text-primary text-decoration-underline">{{item.email}}</span>
        </template>
        <template v-slot:item.roles="{item}">
          <v-chip label color="info" variant="tonal" density="compact" v-for="role in item.roles" :key="role">{{ role }}</v-chip>
        </template>
        <template v-slot:item.action="{item}">
          <ListMenuWithIcon :menu-items="usersAction" @onSelect="onSelect($event, item)" />
        </template>
        <template v-slot:no-data>
          <div class="text-center pa-7">
            <div class="mb-3">
              <v-avatar color="primary" variant="tonal" size="x-large">
                <i class="ph-magnifying-glass ph-lg"></i>
              </v-avatar>
            </div>
            <div class="text-subtitle-1 font-weight-bold">
              Sorry! No Result Found
            </div>
            <!--        <div class="text-muted mt-1">-->
            <!--          We've searched more than 150+ products We did not find any products-->
            <!--          for you search.-->
            <!--        </div>-->
          </div>
        </template>
      </v-data-table-server>

    </v-card-text>
  </v-card>
  <CreateEditUserDialog
    v-if="userDetail"
    v-model="createEditDialog"
    :itemDetail="userDetail"
    @onUpdate="onUpdate"
    @onCreate="onCreate"
  />

<!--  <CreateMultipleUrlDialog-->
<!--      v-if="userDetail"-->
<!--      v-model="createEditDialog"-->
<!--      :itemDetail="userDetail"-->
<!--      @onUpdate="onUpdate"-->
<!--      @onCreate="onCreate"-->
<!--  />-->

  <RemoveItemConfirmationDialog
    v-if="confirmationUser"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />
</template>
