import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {
        btnEliminar.addEventListener('click', (evt) => {
            const urlProyecto = evt.target.dataset.proyectoUrl;
            // console.log(urlProyecto);

            Swal.fire({
                title: 'Estas seguro de eliminar?',
                text: "El proyecto eliminado no se puede recuperar !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // ! peitcion con axios
                    const url = `${location.origin}/proyectos/${urlProyecto}`;

                    axios.delete(url, { params: {urlProyecto} }).then( (res) => {
                        // console.log(res);
                    });

                    Swal.fire(
                        'Eliminado !',
                        res.data,
                        'Correctamente'
                    );
            
                    setTimeout( () => {
                        window.location.href = '/';
                    }, 3000);
                }
            }).catch( () => {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo algun error !!',
                    text: 'No se pudo borrar el proyecto'
                });
            })
        });
} 

export default btnEliminar;