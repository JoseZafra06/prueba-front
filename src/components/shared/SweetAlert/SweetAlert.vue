<template>
    <div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: 'SweetAlert-c',
    props: {
        swal: String,
    },
    methods: {
        showConfirmSimple2(title, text, icon, accion) {
            return new Promise((resolve) => {
                Swal.fire({
                    title: title,
                    text: text,
                    icon: icon,
                    showCancelButton: true,
                    confirmButtonText: accion,
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    resolve(result);
                });
            });
        },
        showSuccess(text) {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: text,
            });
        },
        showWarning(text) {
            Swal.fire({
                icon: "warning",
                title: "Alerta",
                text: text,
            });
        },
        showInfo(text) {
            Swal.fire({
                icon: "info",
                title: "¡Atención!",
                text: text,
            });
        },
        
        showError(text) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: text,
            });
        },
    },
};
</script>
