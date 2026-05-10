import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const {data, isPending, isError} = useGetLpList({});

  if(isPending){
    return <div className={'mt-20'}>Loading...</div>
  }

  if(isError){
    return <div className={'mt-20'}>Error...</div>
  }
  return (
    <div>
      {data?.map((lp) => <h1>{lp.title}</h1>)}
    </div>
  )
}

export default HomePage;