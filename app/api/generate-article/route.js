import OpenAI from 'openai';
const openai = new OpenAI();

openai.apiKey = process.env.OPENAI_API_KEY;

export async function POST(request) {
    try {
        const { tweetText, language } = await request.json();
        console.log('Text:', tweetText); // Debug: print the tweet text
        console.log('Language:', language); // Debug: print the selected language

        const articleObject = await generateResponse(tweetText, language);

        if (language === 'both') {
            console.log('Both:', articleObject);
        } else {
            return new Response(JSON.stringify({ 'title': articleObject.title, 'article': articleObject.article, 'lan': language }), { status: 200 });
        }

    
    } catch (error) {
        console.error('Error fetching article text:', error);
        return new Response(JSON.stringify({ error: 'Error fetching article text' }), { status: 500 });
    }
}

async function generateResponse(message_body, language) {
    try {
        const thread = await openai.beta.threads.create();
        await addMessage(thread.id, message_body, language);
        const response = await runAssistant(thread.id);
        return response;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

async function addMessage(threadId, content, language) {
    try {
        let prompt;
        switch(language) {
            case 'french':
                prompt = `Générez un article en français basé sur le tweet suivant : "${content}"`;
                break;
            case 'both':
                prompt = `Generate an article in both English and French based on the following tweet: "${content}".`;
                break;
            default:
                prompt = `Generate an article in English based on the following tweet: "${content}"`;
        }

        await openai.beta.threads.messages.create(
             threadId, {
                role: 'user',
                content: prompt,
            });
    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
}

async function runAssistant(threadId) {
    try {
        const assistantId = 'asst_WJH1uiwXjLmsg4uFFA4e1utc' //'asst_dIKQMof0JxddVPlYw6yLinmp'; // Replace with your Assistant ID
        let run = await openai.beta.threads.runs.create(
             threadId,
             {
                assistant_id: assistantId,
             });

        while (run.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 500));
            run = await openai.beta.threads.runs.retrieve(threadId, run.id);
            console.log('checking run status', run.status); // Debug: print the run status
        }

        const messages = await openai.beta.threads.messages.list(threadId);

       
        if (messages.data.length > 0) {
            const responseMessage = messages.data.find(msg => msg.role === 'assistant');
            if (responseMessage && responseMessage.content.length > 0) {
                console.log(responseMessage.content);
                // return responseMessage.content[0].text.value;
                return JSON.parse(responseMessage.content[0].text.value);
            } else {
                throw new Error('No response from the assistant.');
            }
        } else {
            throw new Error('No messages found.');
        }
    } catch (error) {
        console.error('Error running assistant:', error);
        throw error;
    }
}
