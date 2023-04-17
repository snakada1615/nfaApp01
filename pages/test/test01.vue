<template>
  <b-container>
    <test-story-book :my-family="myFamily" />
  </b-container>
</template>

<script>
import testStoryBook from '@/components/atoms/testStoryBook'

export default {
  name: 'MyTest01',
  components: {
    testStoryBook,
  },
  data() {
    return {
      myFamily: [
        {
          id: 8,
          name: 'nakaniwa',
          age: 58,
          isCat: false,
          vaccinationDates: ['hotel', 7, 'hop'],
        },
        {
          id: 32,
          name: 'hong',
          age: 5,
          isCat: true,
          vaccinationDates: [22, 17, 9],
        },
      ],
    }
  },
}
</script>
