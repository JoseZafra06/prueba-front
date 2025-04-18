<template>
    <div>
      <v-card elevation="10" class="mt-3">
          <v-card-title>
              Mesas
              <v-spacer/>
              <v-btn color="primary" @click="mtdModalShow(0, null)"><v-icon left>mdi-plus</v-icon> Nuevo</v-btn>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="desserts"
              :items-per-page="5"
              class="elevation-1"
          >
            <template slot="item.ubicacion" slot-scope="props">
              {{ props.item.ubicacion ? props.item.ubicacion : '-' }}
            </template>
            <!--Contador Index-->
            <template slot="item.index" slot-scope="props">
              {{ props.index + 1 }}
            </template>
            <!--Acciones-->
            <template slot="item.acciones" slot-scope="props">
              <v-icon class="mr-2" color="blue" @click="mtdModalShow(1, props.item)">mdi-pencil</v-icon>
              <v-icon color="red" @click="datadetail(props.item.id, 2)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
                Sin Registros
            </template> 
          </v-data-table>
      </v-card>
      <cModalMesa  ref="cmodal" :num="modal.num" :payload="modal.payload" :title="modal.title" 
      :boo_modal="modal.modal_form" @closeModal="closeModal" @datadetail="datadetail" />
      <SweetAlert :swal="swal" ref="SweetAlert" />
    </div>
</template>
<script>
import SweetAlert from '@/components/shared/SweetAlert/SweetAlert.vue';
import cModalMesa from '@/components/Modals/cModalMesa.vue';
  export default {
    components: {
        SweetAlert,
        cModalMesa
    },
    data () {
      return {
        swal: null,
        search: '',
        headers: [
          { text: 'N°', value: 'index' },
          { text: 'Numero de Mesa', value: 'numero_mesa' },
          { text: 'Capacidad', value: 'capacidad' },
          { text: 'Ubicacion', value: 'ubicacion' },
          { text: 'Acciones', value: 'acciones' },
        ],
        desserts: [],
        modal: {
            title: '',
            modal_form: false,
            num: null,
            payload: {},
        },
      }
    },
    created() {
        this.mtdGetData();
    },
    methods: {

      //Traer Data (Listado)
      async mtdGetData() {
          try {
              const apiUrl = process.env.VUE_APP_API_URL;
              const url = `${apiUrl}/Mesa/listMesa`;
              const res = await fetch(url);
              const response = await res.json();

              if (response.statusCode == 200) {
                this.desserts = response.data.map(item => ({
                  id: item.id,
                  numero_mesa: item.numero_mesa,
                  capacidad: item.capacidad,
                  ubicacion: item.ubicacion,
                  state: item.state,
                  actions: ''
                }));
              } else {
                  this.$refs.SweetAlert.showError("Error");
              }
          } catch (error) {
              this.$refs.SweetAlert.showError("Error: " + error);
          }
      },

      //Abrir Modal
      mtdModalShow(num, payload) {
        this.modal.title = (num == 0) ? 'Registrar Mesa' : 'Editar Mesa';
        this.modal.modal_form = true;
        this.modal.num = num;
        this.modal.payload = payload;
      },

      datadetail(payload_detail, num_detail) {
          if (num_detail == 0) {
              payload_detail.action = 'c';
              this.addDatadetail(payload_detail, num_detail);
          } else if (num_detail == 1) {
              payload_detail.action = 'u';
              this.addDatadetail(payload_detail, num_detail);
          } else {
              let data = {
                  action : 'd',
                  id : payload_detail
              }
              this.$refs.SweetAlert.showConfirmSimple2("","¿Estás seguro?","warning","Eliminar") 
              .then((result) => {
                  if (result.value) {
                      this.addDatadetail(data, num_detail);
                  }
              });
          }
      },
      
      async addDatadetail(payload_detail, num_detail) {
        try {
          const apiUrl = process.env.VUE_APP_API_URL;
          const url = `${apiUrl}/Mesa/crudMesa`;

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload_detail)
          });

          const response = await res.json();

          if (response.statusCode == 200) {
            if(response.data.status == 1){
              this.$refs.SweetAlert.showWarning("Ya existe ese Numero de Mesa Registrado");
            }else{
              if (num_detail == 2) {
                this.$refs.SweetAlert.showSuccess("El registro ha sido eliminado");
                this.action = payload_detail.action;
                this.mtdGetData();
              } else {
                this.$refs.SweetAlert.showSuccess(num_detail == 0 ? "Registro Exitoso" : "Modificación Exitosa");
                this.mtdGetData();
                this.$nextTick(() => {
                  this.$refs.cmodal.clearData();
                });
                this.closeModal();
              }
            }
          }
        } catch (error) {
          this.$refs.SweetAlert.showError("Error: " + error);
        }
      },
      
      //Cerrar Modal
      closeModal: function () {
          this.modal = {
              title: '',
              modal_form: false,
              num: null,
              payload: {},
          }
      },
    },
  }
</script>   