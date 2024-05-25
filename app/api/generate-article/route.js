import OpenAI from 'openai';
const openai = new OpenAI();

openai.apiKey = process.env.OPENAI_API_KEY;

export async function POST(request) {
    try {
        const { tweetText } = await request.json();
        console.log('Text:', tweetText); // Debug: print the tweet text

        const articleObject = await generateResponse(tweetText);

        return new Response(JSON.stringify({ 'title': articleObject.title, 'article': articleObject.article  }), { status: 200 });
    } catch (error) {
        console.error('Error fetching article text:', error);
        return new Response(JSON.stringify({ error: 'Error fetching article text' }), { status: 500 });
    }
}

async function generateResponse(message_body) {
    try {
        const thread = await openai.beta.threads.create();
        await addMessage(thread.id, message_body);
        const response = await runAssistant(thread.id);
        return response;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

async function addMessage(threadId, content) {
    try {
        await openai.beta.threads.messages.create(
             threadId,{
                role: 'user', // Ensure the role parameter is included
                content: content,
            });
    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
}

async function runAssistant(threadId) {
    try {
        const assistantId = 'asst_dIKQMof0JxddVPlYw6yLinmp'; // Replace with your Assistant ID
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
