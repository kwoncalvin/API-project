import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { postGroup, putGroup, postGroupImage } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function CreateGroupPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const groupId = params.groupId;
    const isCreate = !groupId;
    const group = useSelector((state) => state.groups.singleGroup);

    const [city, setCity] = useState(group ? group.city : "");
    const [state, setState] = useState(group ? group.state : "");
    const [name, setName] = useState(group ? group.name : "");
    const [about, setAbout] = useState(group ? group.about : "");
    const [type, setType] = useState(group? group.type : "");
    const [privacy, setPrivacy] = useState(group? group.private: "");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});

    const changeLocation = (location) => {
        location = location.split(', ');
        setCity(location[0]);
        setState(location[1]);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            about,
            type,
            private: privacy,
            city,
            state,
        };
        let group;
        if (isCreate) {
            group = await dispatch(postGroup(payload))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
            });
            if (group) {
                dispatch(postGroupImage(group.id, image, true));
            }
        } else {
            group = await dispatch(putGroup(payload, groupId))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
            });
        }
        if (group) {
            history.push(`/groups/${group.id}`)
        }
    }

    return (
        <div>
            {isCreate ? (
                <div>
                    <h3>BECOME AN ORGANIZER</h3>
                    <h2>
                        We'll walk you through a few steps to build your
                        local community
                    </h2>
                </div>
            ) : (
                <div>
                    <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
                    <h2>
                        We'll walk you through a few steps to update
                        your group's information
                    </h2>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>
                        First, set your group's location.
                    </h2>
                    <p>
                        Meetup groups meet locally, in person and online.
                        We'll connect you with people in your area, and
                        more can join you online.
                    </p>
                    <input
                        placeholder="City, STATE"
                        onChange={(e) => changeLocation(e.target.value)}
                    >
                    </input>
                </div>

                <div>
                    <h2>
                        What will your group's name be?
                    </h2>
                    <p>
                        Choose a name that will give people a clear idea of
                        what the group is about. Feel free to get creative!
                        You can edit this later if you change your mind.
                    </p>
                    <input
                        placeholder="What is your group name?"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </input>
                </div>

                <div>
                    <h2>
                        Now describe what your group will be about
                    </h2>
                    <p>
                        People will see this when we promote your group,
                        but you'll be able to add to it later, too.
                    </p>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea
                        placeholder="Please write at least 30 characters"
                        onChange={(e) => setAbout(e.target.value)}
                    >
                    </textarea>
                </div>

                <div>
                    <h2>
                        Final steps...
                    </h2>
                    <label>Is this an in person or online group?</label>
                    <select
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">(select one)</option>
                        <option value="Online">Online</option>
                        <option value="In person">In person</option>
                    </select>
                    <label>Is this group private or public?</label>
                    <select
                        onChange={(e) => setPrivacy(e.target.value)}
                    >
                        <option value="">(select one)</option>
                        <option value="false">Public</option>
                        <option value="true">Private</option>
                    </select>
                    <label>Please add in image url for your group below:</label>
                    <input
                        placeholder="Image Url"
                        onChange={(e) => setImage(e.target.value)}
                    >
                    </input>
                </div>
                <button type='submit'> {isCreate ? "Create Group" : "Update Group"} </button>
            </form>
        </div>
    )
}
