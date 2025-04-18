<template>
    <v-dialog v-model="visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text>
                <v-form
                    ref="form"  v-model="formValid"
                >
                    <span class="text-caption">Comensal <span style="color: red;">*</span></span>
                    <v-select
                        v-model="data_detail.comensal_id"
                        :items="itemsComensal"
                        item-text="nombre"
                        item-value="id"
                        label="Comensal"
                        dense
                        solo
                        :rules="[rules.required]"
                    ></v-select>
                    
                    <span class="text-caption">Numero de Mesa <span style="color: red;">*</span></span>
                    <v-select
                        v-model="data_detail.mesa_id"
                        :items="itemsMesa"
                        item-text="numero_mesa"
                        item-value="id"
                        label="Numero de Mesa"
                        dense
                        solo
                        :rules="[rules.required]"
                        @input="handleMesaSeleccionada"
                    ></v-select>

                    <v-text-field v-if="data_detail.mesa_id"
                        v-model="capacidad"
                        label="Capacidad"
                        required
                        disabled
                    >
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.numero_de_personas"
                        :rules="[rules.required, rules.numeric]"
                        required
                        @keypress="isNumber($event)"
                    >
                        <template v-slot:label>
                            <span>Numero de Personas <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.fecha"
                        :rules="[rules.required]"
                        required
                        type="date"
                        :min="currentDate"
                    >
                        <template v-slot:label>
                            <span>Fecha <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.hora"
                        :rules="[rules.required]"
                        required
                        type="time"
                    >
                        <template v-slot:label>
                            <span>Hora <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                </v-form>
            </v-card-text>
            

            <v-card-actions class="justify-end">
                <v-btn color="secondary" text @click="closeModal()">
                    Cerrar
                </v-btn>
                <v-btn color="primary" text  :disabled="!formValid" @click="dataDetail()">
                    {{ (num == 0 ) ? 'Registrar':'Editar' }}
                </v-btn>
            </v-card-actions>
        </v-card>
        <SweetAlert :swal="swal" ref="SweetAlert" />
    </v-dialog>
</template>
  
<script>
    import SweetAlert from '@/components/shared/SweetAlert/SweetAlert.vue';
    import moment from 'moment';
    export default {
        components: {
            SweetAlert
        },
        data() {
            return {
                swal: null,
                visible: false,
                formValid: false,
                data_detail: {
                    comensal_id: '',
                    mesa_id: '',
                    fecha: '',
                    hora: '',
                    numero_de_personas: ''
                },
                rules: {
                    required: v => !!v || 'Este campo es obligatorio',
                    numeric: v => Number.isInteger(+v) && +v > 0 || 'Debe ser un número entero mayor que 0',
                },
                itemsComensal: [],
                itemsMesa: [],
                capacidad: null,
                currentDate: moment().format('YYYY-MM-DD'),
            };
        },
        props: {
            title: String,
            boo_modal: Boolean,
            num: Number,
            payload: {
                type: Object,
                default: null
            }
        },
        watch: {
            boo_modal(val) {
                this.visible = val;
            },
            payload: {
                handler(newVal) {
                    this.mtdGetDataComensal();
                    this.mtdGetDataMesa();
                    if(this.num == 1){
                        if (newVal) {
                        this.data_detail = {
                            ...newVal
                        };
                        this.handleMesaSeleccionada();
                    }
                    }
                },
                immediate: true,
            },
        },
        methods: {
            closeModal() {
                this.clearData();
                this.$emit('closeModal');
            },
            clearData() {
                this.data_detail = {
                    comensal_id: '',
                    mesa_id: '',
                    fecha: '',
                    hora: '',
                    numero_de_personas: ''
                };
                this.visible = false;
                this.$nextTick(() => {
                    this.$refs.form.resetValidation();
                });
            },
            dataDetail() {
                if (parseFloat(this.data_detail.numero_de_personas) > parseFloat(this.capacidad)) {
                    this.$refs.SweetAlert.showWarning("El numero de Personas no puede ser mayor a la Capacidad de la Mesa seleccionada");
                    return;
                }
                this.$emit('datadetail', this.data_detail, this.num)
                this.closeModal();
            },

            //Traer Data Comensal
            async mtdGetDataComensal() {
                try {
                    const apiUrl = process.env.VUE_APP_API_URL;
                    const url = `${apiUrl}/Comensal/listComensal`;
                    const res = await fetch(url);
                    const response = await res.json();

                    if (response.statusCode == 200) {
                        this.itemsComensal = response.data.map(item => ({
                            id: item.id,
                            nombre: item.nombre,
                        }));
                    } else {
                        this.$refs.SweetAlert.showError("Error");
                    }
                } catch (error) {
                    this.$refs.SweetAlert.showError("Error: " + error);
                }
            },

            //Traer Data Mesa
            async mtdGetDataMesa() {
                try {
                    const apiUrl = process.env.VUE_APP_API_URL;
                    const url = `${apiUrl}/Mesa/listMesa`;
                    const res = await fetch(url);
                    const response = await res.json();

                    if (response.statusCode == 200) {
                        this.itemsMesa = response.data.map(item => ({
                            id: item.id,
                            numero_mesa: item.numero_mesa,
                            capacidad: item.capacidad,
                        }));
                    } else {
                        this.$refs.SweetAlert.showError("Error");
                    }
                } catch (error) {
                    this.$refs.SweetAlert.showError("Error: " + error);
                }
            },

            //Traer la Cpacidad de la Mesa Seleccionada
            handleMesaSeleccionada() {
                const mesa = this.itemsMesa.find(item => item.id === this.data_detail.mesa_id);
                this.capacidad = mesa ? mesa.capacidad : null;
            },

            //Solo numeros
            isNumber: function (evt) {
                evt = evt ? evt : window.event;
                var charCode = evt.which ? evt.which : evt.keyCode;
                if (charCode < 48 || charCode > 57) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        }
    };
</script>
<style scoped>
.small-round-btn {
  background-color: #1976D2;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
}
</style>
  