import styled from 'styled-components'

export const AddLPContainer = styled.div`
    width: 100%;
    background: #16182d;
    border-radius: 20px;
    padding: 20px;
    color: white;
    margin-bottom: 20px;

    h4 {
        text-align: center;
    }

    .lp-value {
        border-radius: 6px;
    }

    .push-button {
        padding: 10px 30px;
        font-size: 15px;
        font-weight: 700;
        color: white !important;
        border-radius: 10px;
        background-image: linear-gradient(150deg, #57048A 0%, #0047FF 78%);
        cursor: pointer;

        transition: all .2s ease-in-out;

        &:hover {
            filter: drop-shadow(0 0 6px #fff2);
        }

        &:active {
            filter: drop-shadow(0 0 6px #0008);
        }
    }

    .button-frame {
        gap: 20px;
        flex-gap: 20px;
    }

    .lp-frame {
        padding: 0px 0px 20px 15px;

        .lp-link {
            color: #ccc;
            text-decoration: none;

            transition: all 0.2s ease-in-out;

            &:hover {
                color: white;
            }
        }

        .lp-fee {
            padding: 6px 20px;
            background: #06f;
            border-radius: 20px;
        }
    }

    .max-label {
        color: #06f;
        text-decoration: underline;
        cursor: pointer;

        &:hover {
            color: white;
        }
    }

    .react-datepicker__triangle {
        left: 50% !important;
        transform: translate(-50%, 0px) !important;
    }

    .show-item {
        padding: 20px 30px;
        background: linear-gradient(180deg, #181d36 0%, #15192f 100%);
        border-radius: 12px;
        gap: 10px;
        flex-gap: 10px;

        transition: all .8s ease-in-out;
        cursor: pointer;
        filter: drop-shadow(2px 2px 8px #0004);

        &:hover {
            transform: translate(0px, -2px) scale(1.05, 1.05);
            filter: drop-shadow(2px 2px 8px #0006);
        }
    }

    .small-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #06f;
    }
`
