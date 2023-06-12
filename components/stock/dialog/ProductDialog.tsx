import React, { useState, useContext } from 'react';
import Summarize from '@mui/icons-material/Summarize';
import Button from '@mui/material/Button';
import MUITextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Snackbar from '@mui/material/Snackbar';
import MUIAlert, { AlertProps } from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import Select from '@/components/FormUI/Select';
import TextField from '@/components/FormUI/TextField';
import { CategoryContext, CategoryContextProps } from '@/contexts/category';

type Props = {
  openProduct: boolean;
  setOpenProduct: (value: boolean) => void;
};

type ProductValue = {
  categoryId: string;
  code: string;
  description: string;
  name: string;
};

const INITIAL_FORM_STATE = {
  categoryId: '',
  code: '',
  description: '',
  name: '',
};
const FORM_VALIDATION = Yup.object().shape({
  categoryId: Yup.string().required('Kategori harus diisi'),
  code: Yup.string().required('Kode harus diisi'),
  description: Yup.string()?.optional(),
  name: Yup.string().required('Nama harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProductDialog({ openProduct, setOpenProduct }: Props) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { categories, isSuccess } = useContext(
    CategoryContext,
  ) as CategoryContextProps;

  const handleClose = () => {
    setOpenProduct(false);
    setOpenSnack(false);
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const mutation = useMutation(
    (data: ProductValue) => {
      return axios.post('/api/products', data);
    },
    {
      onSuccess: () => {
        setErrors(null);
        setOpenSnack(true);
        queryClient.invalidateQueries('products');
      },
      onError: (error: any) => {
        setErrors(error.response.data);
        setOpenSnack(true);
      },
    },
  );

  const handleFormSubmit = (value: ProductValue, { resetForm }: any) => {
    const { categoryId, code, description, name } = value;
    const payload = {
      categoryId,
      code,
      description,
      name,
    };
    mutation.mutate(payload);
    resetForm();
  };

  return (
    <div>
      <Dialog open={openProduct} onClose={handleClose} maxWidth="xs">
        <CardHeader
          style={{ paddingBottom: 0 }}
          avatar={
            <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
              <Summarize style={{ color: 'white' }} />
            </Avatar>
          }
          title="Tambah Barang"
        />
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, values, handleChange }) => (
            <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
              <DialogContent>
                <DialogContentText
                  variant="caption"
                  align="center"
                  marginBottom="0.5rem"
                >
                  Input barang hanya dilakukan ketika barang belum pernah
                  diinput sebelumya, jika sudah pernah diinput, maka seharusnya
                  cukup dengan tambah stok, dankee.
                </DialogContentText>
                <Select
                  name="categoryId"
                  fullWidth
                  label="Kategori"
                  options={isSuccess && categories}
                  size="small"
                  style={{ textTransform: 'capitalize' }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Kode Barang"
                  name="code"
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nama Barang"
                  name="name"
                  size="small"
                />
                <MUITextField
                  label="Multiline"
                  multiline
                  name="description"
                  fullWidth
                  rows={4}
                  margin="normal"
                  onChange={handleChange}
                  value={values.description}
                  placeholder="Diisi keterangan barang (optional), misalnya kegunaan barang, warna dll. yang sekiranya dibutuhkan."
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  Tambah
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={errors ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {errors ? errors?.message : 'Produk berhasil dibuat !'}
        </Alert>
      </Snackbar>
    </div>
  );
}
