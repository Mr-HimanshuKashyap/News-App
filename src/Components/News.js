import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=> {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, settotalResults] = useState(0)
  
 const captializeFirstLetter = (string) => {
   return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async ()=> {
    props.setProgress(15)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=2303861009aa4d08810c46f85ccb2b00&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(parseData.articles)
    setLoading(false)
    settotalResults(parseData.totalResults)

    props.setProgress(100)
  }

useEffect(() => {
  document.title = `${captializeFirstLetter(props.category)} - NewsAround`;
  updateNews();
  // eslint-disable-next-line
}, [])

const fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=2303861009aa4d08810c46f85ccb2b00&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    // setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles))
    settotalResults(parseData.totalResults)
    
  };

    return (
      <div className="container my-3">
        <h2 className="text-center" style={{margin: '70px 0px 10px 0px'}}>
          NewsAround - Top {captializeFirstLetter(props.category)}{" "}
          Headlines
        </h2>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
          >
        <div className="container">
        <div className="row">
          {/**!loading &&**/
            articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title}
                    description={element.description}
                    imageurl={element.urlToImage}
                    newsUrl={element.url}
                    date={element.publishedAt}
                  />
                </div>
              );
            })}
        </div>
        </div>
        </InfiniteScroll>
       
      </div>
    );
  }
News.defaultProps = {
  country: "in",
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
};

export default News;
