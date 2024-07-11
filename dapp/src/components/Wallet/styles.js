import styled from 'styled-components'

export const ChainSelectContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-gap: 20px;
    gap: 20px;

    padding: 20px;
    background: #11132e;
    border-radius: 10px;

    cursor: pointer;

    transition: all .8s ease-in-out;

    &:hover {
        transform: translate(0, -4px);

        .selected-mark {
            transform: scale(1.3, 1.3);
        }
    }

    .logo {
        width: 32px;
    }

    .selected-mark {
        font-size: 24px;
        color: #0f0;
        width: 40px;

        transition: all .4s ease-in-out;
    }

    .description {
        font-size: 0.8rem;
    }
`