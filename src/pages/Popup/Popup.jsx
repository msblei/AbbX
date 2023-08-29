import React, { useState, useEffect } from 'react';
import {
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Configuration, OpenAIApi } from 'openai';
import secrets from 'secrets';

const Popup = () => {
  console.log('loading popup');
  const [error, SetError] = useState(false);
  const [selectedText, setSelectedText] = useState();

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      { message: 'getSelectedText' },
      function (response) {
        console.log('get answer', response);
        setSelectedText(response);

        if (!response) {
          setResponse('Please select text.');
        }
      }
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const configuration = new Configuration({
    apiKey: secrets.OpenAPI,
  });

  const openai = new OpenAIApi(configuration);

  async function handleSubmit(selectedText) {
    setIsLoading(true);

    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful AI assistant that identifies abbreviations in the given text and explains them.',
          },
          {
            role: 'user',
            content: `List all abbreviations in the following sentence and explain them: ${selectedText}.`,
          },
        ],
      });
      console.log('ceompletion', completion);
      setResponse(completion.data.choices[0].message.content);
      setIsLoading(false);
    } catch (e) {
      setResponse(e);
      SetError(true);

      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log('selectedText', selectedText);
    if (selectedText) {
      handleSubmit(selectedText);
    }
  }, [selectedText]);

  return (
    <Container
      sx={{
        height: 300,
        width: 400,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <Grid container>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom color="white" align="center">
            Abbreviation Explanation
          </Typography>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: error ? '#F4442E' : 'white',
            }}
            align="center"
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Typography variant="body2" gutterBottom color="black">
                {response}
              </Typography>
            )}
          </Paper>
          <Divider />
          <Typography
            variant="caption"
            display="block"
            color="grey"
            gutterBottom
          >
            Tip: The more context the better the results.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Popup;
