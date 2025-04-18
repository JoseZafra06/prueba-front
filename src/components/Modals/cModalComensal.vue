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
                        v-model="data_detail.nombre"
                        :rules="[rules.required]"
                        required
                    >
                        <template v-slot:label>
                            <span>Nombre <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.correo"
                        :rules="[rules.required, rules.email]"
                        required
                    >
                        <template v-slot:label>
                            <span>Correo <span style="color: red;">*</span></span>
                        </template>
                    </v-text-field>

                    <v-text-field
                        v-model="data_detail.telefono"
                         label="Telefono"
                        maxlength="9"
                        :rules="[rules.phoneLength]"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="data_detail.direccion"
                         label="Direccion"
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
                    nombre: '',
                    correo: '',
                    telefono: '',
                    direccion: ''
                },
                rules: {
                    required: v => !!v || 'Este campo es obligatorio',
                    email: v =>
                    /.+@.+\..+/.test(v) || 'Ingrese un correo válido',
                    phoneLength: v => {
                        if (!v) return true;
                        return /^\d{9}$/.test(v) || 'El número debe tener 9 dígitos';
                    }
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
                    nombre: '',
                    correo: '',
                    telefono: '',
                    direccion: ''
                };
                this.visible = false;
                this.$nextTick(() => {
                    this.$refs.form.resetValidation();
                });
            },
            dataDetail() {
                this.$emit('datadetail', this.data_detail, this.num)
                this.closeModal();
            },
        }
    };
</script>
  