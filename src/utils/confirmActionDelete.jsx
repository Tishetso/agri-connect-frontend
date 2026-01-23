import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

//resident
export const confirmActionDelete = async ({
    title = 'Are you sure?',
    text = 'This action cannot be undone.',
    confirmButtonText = 'Yes, proceed',
    cancelButtonText = 'Cancel',
    icon = 'warning',
    confirmButtonColor = '#d33',
    cancelButtonColor = '#3085d6',
} = {}) => {
    const result = await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true, //shows confirm on right
        focusCancel: true,      //better accessibility
    });

    return result.isConfirmed; //true if user clicked confirm


};