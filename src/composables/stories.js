import { ref } from 'vue'
import http from "../http-common";
import { useRouter } from 'vue-router'

export default function useStories() {
    const story = ref([]) // just one story
    const stories = ref([])

    const errors = ref([]) //array of strings
    const router = useRouter()

    const getStories = async () => {
        try {
            let response = await http.get('/api/stories')
            console.log(response.data.data)

            stories.value = response.data.data
            console.log(stories.value);
        } catch (error) {
            console.log(error.message);
        }
    }

    const getStory = async (id) => {
        console.log(id);
        let response = await http.get(`/api/stories/${id}`)
        story.value = response.data.data
    }

    const storeStory = async (data) => {
        errors.value = []
        try {
            await http.post('/api/stories-inserts', data)
            await router.push({ name: 'stories.index' })
        } catch (e) {
            if (e.response.status === 400) { //Bad request, for validation in .net core
                
                for (const key in e.response.data.errors) {
                    errors.value.push(e.response.data.errors[key][0]) ;
                }
            }
        }

    }

    const updateStory = async (id) => {
        errors.value = [];
        try {
            // http method must be put for match put method in .net core api
            await http.put(`/api/stories-update/${id}`, story.value) 
            await router.push({ name: 'stories.index' })
        } catch (e) {
            if (e.response.status === 400) { //Bad request, for validation
               
                for (const key in e.response.data.errors) {
                    errors.value.push( e.response.data.errors[key][0]);
                }
            }
        }
    }

    const destroyStory = async (id) => {
        await http.delete(`/api/stories-destory/${id}`)
    }
    /** search by title */
    const getStoriesByPlot = async (searchQuery) => {
        if(searchQuery.trim() === '') // this value is required and can't be empty for be sent to the api
            return;
        let response = await http.get(`/api/stories-by-plot/${searchQuery}`)
        stories.value = response.data.data
    }

    return {
        errors,
        story,
        stories,
        getStory,
        getStories,
        storeStory,
        updateStory,
        destroyStory,
        getStoriesByPlot
    }
}