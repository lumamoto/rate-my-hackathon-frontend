import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { Header, Container, Button, Grid, Message, Divider } from "semantic-ui-react";

function calculateAvgRating(ratings) {
  var sum = 0;
  for (var i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  var avg = sum / ratings.length;
  avg = Math.round(avg * 10) / 10; // round to nearest decimal
  return avg;
}
class ViewHackathon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hackathon: {},
    };
  }

  componentDidMount() {
    // console.log("Print id: " + this.props.match.params.id);
    axios
      .get("http://localhost:8082/api/hackathons/" + this.props.match.params.id)
      .then((res) => {
        // console.log("Print-ViewHackathon-API-response: " + res.data);
        this.setState({
          hackathon: res.data,
        });
      })
      .catch((err) => {
        console.log("Error from ViewHackathon");
      });
  }

  // For delete hackathon button:
  // onClick={this.onDeleteClick.bind(this, hackathon._id)}
  onDeleteClick(id) {
    axios
      .delete("http://localhost:8082/api/hackathons/" + id)
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log("Error form ViewHackathon_deleteClick");
      });
  }

  // To edit hackathon:
  // <Link to={`/edit-hackathon/${hackathon._id}`} />

  render() {
    const hackathon = this.state.hackathon;

    // get list of reviews, if any
    let reviewList;
    if (hackathon.reviews === undefined || hackathon.reviews.length < 1) {
      reviewList = (
        <div>
        <Message>
          <Grid textAlign="center">
            <Grid.Row><br/></Grid.Row>
            <Grid.Row>
              <Header as="h2">No Reviews</Header>
            </Grid.Row>
            <Grid.Row>
              <p>
                This hackathon doesn't have any reviews. Why not be the first to{" "}
                <Link to={`/new-review/${hackathon._id}`}>add one</Link>?
              </p>
            </Grid.Row>
            <Grid.Row><br/></Grid.Row>
          </Grid>
        </Message>
        <Divider hidden/>
        <Divider hidden/>
        <Divider hidden/>
        <Divider hidden/>
        </div>
      );
    } else {
      reviewList = hackathon.reviews.map((review, k) => (
        <ReviewCard review={review} key={k} />
      ));
    }

    // calculate avg rating
    let avgRating, ratingString, numReviews;
    console.log(hackathon.reviews);
    if (hackathon.reviews) {
      var ratings = [];
      const reviews = hackathon.reviews;
      numReviews = reviews.length;
      for (var i = 0; i < reviews.length; i++) {
        ratings.push(reviews[i].rating);
      }
      avgRating = calculateAvgRating(ratings);
      if (isNaN(avgRating)) {
        avgRating = 0;
        ratingString = "No Rating";
      } else {
        ratingString = avgRating + " / 5";
      }
    } else {
      avgRating = 0;
      numReviews = 0;
      ratingString = "No Rating";
    }

    return (
      <div>
        <Container>
          <Grid>
            <Grid.Column width={12}>
              <Header as="h1" style={{ padding: "1.5em 0em 1.5em" }}>
                {hackathon.name}
                <Header.Subheader>
                  {hackathon.description}
                  {/* <Link to={hackathon.url}>Hackathon Website</Link> */}
                  <br />
                  <br />
                </Header.Subheader>
                
                <Link to={`/new-review/${hackathon._id}`}>
                  <Button primary>Add a Review</Button>
                </Link>
                {/* <Link to={"/"}>
                <Button>Suggest Changes</Button>
              </Link> */}
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              <Header as="h1" style={{ padding: "1.5em 0em 1.5em" }}>
                {ratingString}
                <Header.Subheader>{numReviews} Reviews</Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid>
        </Container>
        <Container>
          <Header as="h2">Reviews</Header>
          {reviewList}
        </Container>
      </div>
    );
  }
}

export default ViewHackathon;
