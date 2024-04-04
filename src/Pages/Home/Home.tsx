import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

// ... (other imports remain the same)

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const centeredTextStyles = {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textTransform: 'none', // Remove uppercase transformation if it's applied by default
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Ensure font family is consistent
    fontWeight: '400', // Set the desired font weight
    fontSize: '1rem', // Set the desired font size
  };

  const buttonStyles = {
    ...centeredTextStyles,
    backgroundColor: 'rgb(108, 108, 108)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'gray', // Slightly lighter black on hover
    },
    marginBottom: '10px', // Spacing between buttons
  };

  const accordionStyles = {
    backgroundColor: 'rgb(108, 108, 108)',
    width: "100%",
    color: 'white',
    boxShadow: 'none', // Remove the box shadow from the accordion
    '&:before': {
      display: 'none', // Hide the pseudo-element
    },
    '& .MuiAccordionSummary-root': {
      ...centeredTextStyles,
      minHeight: '48px', // Match the button height if needed
    },
    '& .MuiAccordionSummary-content': {
      margin: '0', // Center the content
      flexGrow: 0, // Prevent stretching
    },
    '& .MuiAccordionSummary-expandIcon': {
      position: 'absolute',
      right: theme.spacing(1), // Ensure the icon is always at the right end
    },
    '& .MuiAccordionDetails-root': {
      flexDirection: 'column',
      padding: theme.spacing(1),
      gap: '10px', // Consistent gap between buttons inside
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: '20px', alignItems: "center", gap: '10px', width: '100%' }}>
      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Estoque
        </AccordionSummary>
        <AccordionDetails sx={accordionStyles['& .MuiAccordionDetails-root']}>
          <Button
            variant="contained"
            onClick={() => navigate('/stock-update')}
            sx={buttonStyles}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/view-products')}
            sx={buttonStyles}
          >
            Consultar
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/add-product')}
            sx={buttonStyles}
          >
            Adicionar novo produto
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Gerar mensagem automática
        </AccordionSummary>
        <AccordionDetails sx={accordionStyles['& .MuiAccordionDetails-root']}>
          <Button
            onClick={() => { }}
            sx={buttonStyles}
          >
            Lista completa
          </Button>
          <Button
            onClick={() => { }}
            sx={buttonStyles}
          >
            Selecionar produtos
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Gerar tabela
        </AccordionSummary>
        <AccordionDetails sx={accordionStyles['& .MuiAccordionDetails-root']}>
          <Button
            onClick={() => { }}
            sx={buttonStyles}
          >
            Completa
          </Button>
          <Button
            onClick={() => { }}
            sx={buttonStyles}
          >
            Selecionar produtos
          </Button>
        </AccordionDetails>
      </Accordion>
      <Outlet />
    </div>
  );
};

export default HomePage;
