<template>
    <div>
      <v-card elevation="10" class="mt-3">
          <v-card-title>
              Reservas
              <v-spacer/>
              <v-btn color="primary" @click="mtdModalShow(0, null)"><v-icon left>mdi-plus</v-icon> Nuevo</v-btn>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="desserts"
              :items-per-page="5"
              class="elevation-1"
          >
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
      <cModalReserva :num="modal.num" :payload="modal.payload" :title="modal.title" 
      :boo_modal="modal.modal_form" @closeModal="closeModal" @datadetail="datadetail" />
      <SweetAlert :swal="swal" ref="SweetAlert" />
    </div>
</template>
<script>
import SweetAlert from '@/components/shared/SweetAlert/SweetAlert.vue';
import cModalReserva from '@/components/Modals/cModalReserva.vue';
  export default {
    components: {
        SweetAlert,
        cModalReserva
    },
    data () {
      return {
        swal: null,
        search: '',
        headers: [
          { text: 'N°', value: 'index' },
          { text: 'Comensal', value: 'nombre' },
          { text: 'Numero de Mesa', value: 'numero_mesa' },
          { text: 'Capacidad', value: 'capacidad' },
          { text: 'Numero de Personas', value: 'numero_de_personas' },
          { text: 'Fecha', value: 'fecha' },
          { text: 'Hora', value: 'hora' },
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
              const url = `${apiUrl}/Reserva/listReserva`;
              const res = await fetch(url);
              const response = await res.json();

              if (response.statusCode == 200) {
                this.desserts = response.data.map(item => ({
                  id: item.id,
                  comensal_id: item.comensal_id,
                  nombre: item.nombre,
                  mesa_id: item.mesa_id,
                  numero_mesa: item.numero_mesa,
                  fecha: item.fecha,
                  hora: item.hora,
                  numero_de_personas: item.numero_de_personas,
                  capacidad: item.capacidad,
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
        this.modal.title = (num == 0) ? 'Registrar Reserva' : 'Editar Reserva';
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
          const url = `${apiUrl}/Reserva/crudReserva`;

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload_detail)
          });

          const response = await res.json();
          if (response.statusCode == 200) {
            if (num_detail == 2) {
              this.$refs.SweetAlert.showSuccess("El registro ha sido eliminado");
              this.action = payload_detail.action;
              this.mtdGetData();
            } else {
              this.$refs.SweetAlert.showSuccess(num_detail == 0 ? "Registro Exitoso" : "Modificación Exitosa");
              this.closeModal();
              this.mtdGetData();
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