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
                    <v-text-field
                        v-model="data_detail.numero_mesa"
                         :rules="[rules.required]"
                        required
                        @keypress="isNumber($event)"
                    >
                        <template v-slot:label>
                            <span>Numero de Mesa <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.capacidad"
                        :rules="[rules.required, rules.numeric]"
                        required
                        @keypress="isNumber($event)"
                    >
                        <template v-slot:label>
                            <span>Capacidad <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.ubicacion"
                         label="Ubicacion"
                        required
                    ></v-text-field>
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
    </v-dialog>
</template>
  
<script>
    export default {
        data() {
            return {
                visible: false,
                formValid: false,
                data_detail: {
                    numero_mesa: '',
                    capacidad: '',
                    ubicacion: '',
                },
                rules: {
                    required: v => !!v || 'Este campo es obligatorio',
                    numeric: v => Number.isInteger(+v) && +v > 0 || 'Debe ser un número entero mayor que 0',
                }
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
                    if(this.num == 1){
                        if (newVal) {
                        this.data_detail = {
                            ...newVal
                        };
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
                    numero_mesa: '',
                    capacidad: '',
                    ubicacion: '',
                };
                this.visible = false;
                this.$nextTick(() => {
                    this.$refs.form.resetValidation();
                });
            },
            dataDetail() {
                this.$emit('datadetail', this.data_detail, this.num)
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
  