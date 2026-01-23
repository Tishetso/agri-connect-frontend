import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmAction = async ({
                                        title = 'Are you sure?',
                                        text = 'This action cannot be undone.',
                                        confirmButtonText = 'Yes, proceed',
                                        cancelButtonText = 'Cancel',
                                        icon = 'warning',
                                    } = {}) => {
    const result = await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#d33', // red for danger
        cancelButtonColor: '#3085d6',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
    });

    return result.isConfirmed; // true if confirmed
};