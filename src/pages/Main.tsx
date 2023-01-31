import {
  Box,
  Fade,
  Modal,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { Error } from "@mui/icons-material";
import {
  appBlockStyle,
  datafieldStyle,
  labelStyle,
  modalStyle,
} from "../constants";
import { FetchedData, Product } from "../types";

function Main() {
  /**
   * UseSearchParams - sharing (updating) URL
   */
  const [searchParams, setSearchParams] = useSearchParams();
  /**
   * useStates
   */
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [openedModalProps, setOpenedModalProps] = useState<Product>();
  const [filteredID, setFilteredID] = useState<number | undefined>();
  const [currentPage, setPage] = useState(1);

  /**
   * set value to create API request with specified ID
   * @param event value to change from keyboard
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    if (!Number.isNaN(newValue)) {
      setFilteredID(newValue);
      setSearchParams(`id=${newValue}`);
    } else {
      setFilteredID(undefined);
      setSearchParams("");
    }
  };

  /**
   * swaping Pagination pages
   */
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
    setSearchParams(`page=${newPage}`);
  };

  /**
   * Opening modal with data from one row
   * @param row corresponding data row
   */
  const handleModalOpen = (row: Product) => {
    setOpenedModalProps(row);
    setIsOpen(true);
  };

  /**
   * Checking if request to API should be made by ID or by page
   */
  const queryParameter = filteredID
    ? `?id=${filteredID}`
    : `?page=${currentPage}`;

  /**
   * Fetch data from API using React-Query
   */
  const { isFetched, isError, data, error } = useQuery<FetchedData, Error>(
    [queryParameter],
    () =>
      fetch(`https://reqres.in/api/products${queryParameter}`).then((res) =>
        res.json()
      )
  );

  //Pagination is received from API - loss of 1 entry per page
  const total_pages = data?.total_pages;
  const products = data?.data;

  //Possible to do by this argument, but task description pointed out to leave 5 items per page
  //const itemsPerPage = data?.per_page;
  const itemsPerPage = 5;

  /**
   * Updating values in case URL is exchanged between users
   */
  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams);
    if (currentParams.page !== undefined) setPage(parseInt(currentParams.page));
    if (currentParams.id !== undefined)
      setFilteredID(parseInt(currentParams.id));
  }, []);

  /**
   * Error block in case of getting rejected Promise from API
   */
  if (isError)
    return (
      <Box sx={appBlockStyle}>
        <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          <Error sx={{ color: "red", fontSize: "72px" }} />
          <Typography sx={{ fontSize: "32px" }}>Error Occured!</Typography>
          <Typography> {error.message}</Typography>
        </Stack>
      </Box>
    );

    /**
     * Modal block, Table with data from API
     */
  return (
    <Box sx={appBlockStyle}>
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Fade in={isOpen}>
          <Box sx={modalStyle}>
            <Stack spacing={2}>
              <Typography sx={labelStyle}>ID</Typography>
              <Typography sx={datafieldStyle}>
                {openedModalProps?.id}
              </Typography>
              <Typography sx={labelStyle}>Color</Typography>
              <Typography
                sx={{
                  ...datafieldStyle,
                  bgcolor: openedModalProps?.color ?? "black",
                }}
              >
                {openedModalProps?.color}
              </Typography>
              <Typography sx={labelStyle}>Name</Typography>
              <Typography sx={datafieldStyle}>
                {openedModalProps?.name}
              </Typography>
              <Typography sx={labelStyle}>Pantone Value</Typography>
              <Typography sx={datafieldStyle}>
                {openedModalProps?.pantone_value}
              </Typography>
              <Typography sx={labelStyle}>Year</Typography>
              <Typography sx={datafieldStyle}>
                {openedModalProps?.year}
              </Typography>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Stack spacing={3}>
        <TextField
          helperText="Type ID to filter:"
          variant="outlined"
          type="number"
          onChange={handleInputChange}
          value={filteredID ?? ""}
        ></TextField>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetched &&
                (Array.isArray(products) ? (
                  products.slice(0, itemsPerPage).map((row) => (
                    <TableRow
                      onClick={() => handleModalOpen(row)}
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        bgcolor: row.color,
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.year}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    key={products?.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      bgcolor: products?.color ?? "white",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {products?.id}
                    </TableCell>
                    <TableCell align="center">{products?.name}</TableCell>
                    <TableCell align="center">{products?.year}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={total_pages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Stack>
    </Box>
  );
}

export default Main;
