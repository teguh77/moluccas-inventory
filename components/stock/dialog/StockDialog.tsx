import React, { useState, useContext } from 'react';
import PostAdd from '@mui/icons-material/PostAdd';
import Button from '@mui/material/Button';
import MUITextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
import CurrencyFieldText, {
  handleValueChange,
} from '@/components/FormUI/CurrencyField';
import { ProductContext, ProductContextProps } from '@/contexts/product';
import { Product } from '@/lib/types';

import Loading from '@/components/Loading';

type Props = {
  openStock: boolean;
  setOpenStock: (value: boolean) => void;
};

type StockValue = {
  description: string;
  price: number;
  quantity: number;
  productId: string;
};

const INITIAL_FORM_STATE: StockValue = {
  description: '',
  price: 0,
  quantity: 0,
  productId: '',
};
const FORM_VALIDATION = Yup.object().shape({
  description: Yup.string().optional(),
  price: Yup.number().required('Harga harus diisi'),
  quantity: Yup.number().required('Jumlah harus diisi'),
  productId: Yup.string().required('ProductId harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StockDialog({ openStock, setOpenStock }: Props) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, isSuccess, isLoading } = useContext(
    ProductContext,
  ) as ProductContextProps;

  const handleClose = () => {
    setOpenStock(false);
    setOpenSnack(false);
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };
  const mutation = useMutation(
    (data: StockValue) => {
      return axios.post('/api/notifs/stockin', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('stocks');
        queryClient.invalidateQueries('notifs');
        setErrors(null);
        setOpenSnack(true);
      },
      onError: (error: any) => {
        setErrors(error.response.data);
        setOpenSnack(true);
      },
    },
  );

  const handleFormSubmit = (value: StockValue, { resetForm }: any) => {
    const { description, price, quantity, productId } = value;
    const payload = {
      description,
      price,
      quantity,
      productId,
    };
    mutation.mutate(payload);
    resetForm();
    setSelectedProduct(null);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <Dialog open={openStock} onClose={handleClose} maxWidth="xs">
          <CardHeader
            style={{ paddingBottom: 0 }}
            avatar={
              <Avatar
                aria-label="recipe"
                style={{ backgroundColor: '#041A4D' }}
              >
                <PostAdd style={{ color: 'white' }} />
              </Avatar>
            }
            title="Tambah Stok"
          />
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleFormSubmit}
          >
            {({
              handleSubmit,
              isSubmitting,
              setFieldValue,
              handleChange,
              values,
            }) => (
              <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
                <DialogContent>
                  <DialogContentText
                    variant="caption"
                    align="center"
                    marginBottom="0.5rem"
                  >
                    Input barang hanya dilakukan ketika barang belum pernah
                    diinput sebelumya, jika sudah pernah diinput, maka
                    seharusnya cukup dengan tambah stok, dankee.
                  </DialogContentText>
                  <Autocomplete
                    options={isSuccess ? products : []}
                    getOptionLabel={(option: Product) =>
                      `${option.code} : ${option.name}`
                    }
                    onChange={(_e, value) => {
                      setFieldValue('productId', value ? value.id : '');
                      setSelectedProduct(value);
                    }}
                    size="small"
                    renderInput={(params) => (
                      <MUITextField
                        variant="outlined"
                        margin="normal"
                        label="Kode Barang"
                        name="productId"
                        {...params}
                      />
                    )}
                  />
                  {selectedProduct ? (
                    <>
                      <MUITextField
                        label="Nama barang"
                        name="name"
                        fullWidth
                        size="small"
                        margin="normal"
                        disabled
                        sx={{ textTransform: 'capitalize' }}
                        value={selectedProduct?.name}
                      />
                      <MUITextField
                        label="Kategori"
                        name="category"
                        fullWidth
                        size="small"
                        margin="normal"
                        disabled
                        sx={{ textTransform: 'capitalize' }}
                        value={selectedProduct?.category}
                      />
                    </>
                  ) : null}
                  <CurrencyFieldText
                    label="Harga Barang"
                    name="price"
                    value={values.price}
                    onValueChange={handleValueChange('price', setFieldValue)}
                    currencySymbol="Rp.&nbsp;"
                  />
                  <MUITextField
                    label="Jumlah Barang"
                    name="quantity"
                    fullWidth
                    size="small"
                    type="number"
                    margin="normal"
                    value={values.quantity}
                    onChange={handleChange}
                  />
                  <MUITextField
                    label="Deskripsi"
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
                    Ajukan
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Dialog>
      )}
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
          {errors
            ? errors?.message
            : 'Usulan penambahan stok berhasil dikirim !'}
        </Alert>
      </Snackbar>
    </div>
  );
}
